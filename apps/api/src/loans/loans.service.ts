import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoanStatus } from './enums/loan-status.enum';
import { ReturnLoanDto } from './dto/return-loan.dto';

const DEACTIVE_STATUSES = [LoanStatus.PENDING, LoanStatus.APPROVED, LoanStatus.BORROWED] as const;
const ACTIVE_LOAN_STATUSES = [LoanStatus.APPROVED, LoanStatus.BORROWED] as const;

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId?: string, status?: LoanStatus) {
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;

    return this.prisma.loan.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async request(userId: string, bookId: string) {
    const existingLoan = await this.prisma.loan.findFirst({
      where: {
        userId,
        bookId,
        status: { in: [...DEACTIVE_STATUSES] },
      },
    });

    if (existingLoan) {
      throw new BadRequestException('Anda sudah mengajukan atau meminjam buku ini');
    }

    const book = await this.prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book || book.availableStock <= 0) {
      throw new BadRequestException('Buku tidak tersedia');
    }

    const overdueLoan = await this.prisma.loan.findFirst({
      where: {
        userId,
        status: LoanStatus.OVERDUE,
      },
    });

    if (overdueLoan) {
      throw new BadRequestException('Anda memiliki peminjaman yang terlambat');
    }

    const activeLoansCount = await this.prisma.loan.count({
      where: {
        userId,
        status: { in: [...ACTIVE_LOAN_STATUSES] },
      },
    });

    if (activeLoansCount >= 3) {
      throw new BadRequestException('Maksimal peminjaman adalah 3 buku');
    }

    return this.prisma.loan.create({
      data: {
        userId,
        bookId,
        requestDate: new Date(),
        status: LoanStatus.PENDING,
      },
      include: {
        book: true,
        user: true,
      },
    });
  }

  async approve(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        book: true,
      },
    });

    if (!loan) {
      throw new BadRequestException('Peminjaman tidak ditemukan');
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Peminjaman tidak dalam status menunggu persetujuan');
    }

    if (loan.book.availableStock <= 0) {
      throw new BadRequestException('Stok buku habis');
    }

    const borrowDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id: loanId },
        data: {
          status: LoanStatus.BORROWED,
          borrowDate,
          dueDate,
        },
        include: {
          user: true,
          book: true,
        },
      }),
      this.prisma.book.update({
        where: { id: loan.bookId },
        data: {
          availableStock: { decrement: 1 },
        },
      }),
    ]);

    return updatedLoan;
  }

  async reject(loanId: string) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
    });

    if (!loan) {
      throw new BadRequestException('Peminjaman tidak ditemukan');
    }

    if (loan.status !== LoanStatus.PENDING) {
      throw new BadRequestException('Peminjaman tidak dalam status menunggu persetujuan');
    }

    return this.prisma.loan.update({
      where: { id: loanId },
      data: { status: LoanStatus.REJECTED },
      include: {
        user: true,
        book: true,
      },
    });
  }

  async return(loanId: string, dto?: ReturnLoanDto) {
    const loan = await this.prisma.loan.findUnique({
      where: { id: loanId },
      include: {
        book: true,
      },
    });

    if (!loan) {
      throw new BadRequestException('Peminjaman tidak ditemukan');
    }

    if (loan.status !== LoanStatus.BORROWED) {
      throw new BadRequestException('Buku tidak sedang dipinjam');
    }

    const returnDate = dto?.returnDate ? new Date(dto.returnDate) : new Date();
    if (Number.isNaN(returnDate.getTime())) {
      throw new BadRequestException('Format tanggal pengembalian tidak valid');
    }

    const isOverdue = loan.dueDate && returnDate > loan.dueDate;

    const [updatedLoan] = await this.prisma.$transaction([
      this.prisma.loan.update({
        where: { id: loanId },
        data: {
          status: isOverdue ? LoanStatus.OVERDUE : LoanStatus.RETURNED,
          returnDate,
        },
        include: {
          user: true,
          book: true,
        },
      }),
      this.prisma.book.update({
        where: { id: loan.bookId },
        data: {
          availableStock: { increment: 1 },
        },
      }),
    ]);

    return updatedLoan;
  }
}
