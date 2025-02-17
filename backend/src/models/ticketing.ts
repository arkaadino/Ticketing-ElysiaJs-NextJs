import { table } from "console";
import { Model, Column, DataType, Table, PrimaryKey } from "sequelize-typescript"; 
import { Status } from "./statuses";
import { Category } from "./categories";
import { Priority } from "./priority";
import { Karyawan } from "./karyawan";

export type TicketingEntity = {
    id?: number;
    id_karyawans?: number;
    id_categories?: number;
    id_statuses?: number;
    keluhan?: string;
    tanggal_keluhan?: Date;
    eskalasi: string;
    response: string;
    pending: string;
    analisa: string;
    mulai_pengerjaan: Date | null;
    selesai_pengerjaan: Date | null;
    waktu_pengerjaan: Date | null;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
};

@Table({
    tableName: "ticketings",
    timestamps: true,
    paranoid: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
})
export class Ticketing extends Model<TicketingEntity> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    }) 
    id!: number;

    @Column({
        type: DataType.INTEGER,
        references: {
            model: Status,
            key: "id",
        },
        allowNull: false, // Tidak boleh kosong
    }) 
    id_statuses!: number;

    @Column({
        type: DataType.INTEGER,
        references: {
            model: Category,
            key: "id",
        },
        allowNull: false, // Tidak boleh kosong
    }) 
    id_categories!: number;

    @Column({
        type: DataType.INTEGER,
        references: {
            model: Karyawan,
            key: "id",
        },
        allowNull: false, // Tidak boleh kosong
    }) 
    id_karyawans!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false, // Tidak boleh kosong
    })
    keluhan!: string;

    @Column({
        type: DataType.DATE,
        allowNull: false, // Tidak boleh kosong
    })
    tanggal_keluhan!: Date;

    @Column({
        type: DataType.STRING,
        allowNull: false, // Tidak boleh kosong
    })
    eskalasi!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false, // Tidak boleh kosong
    })
    response!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false, // Tidak boleh kosong
    })
    pending!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false, // Tidak boleh kosong
    })
    analisa!: string;

    @Column({
        type: DataType.DATE,
        allowNull: true, // Bisa null karena waktu pengerjaan belum mulai
    })
    mulai_pengerjaan!: Date | null;

    @Column({
        type: DataType.DATE,
        allowNull: true, // Bisa null karena pengerjaan bisa belum selesai
    })
    selesai_pengerjaan!: Date | null;

    @Column({
        type: DataType.DATE,
        allowNull: true, // Bisa null karena pengerjaan belum selesai
    })
    waktu_pengerjaan!: Date | null;

    @Column({
        type: DataType.TINYINT,
        defaultValue: 0,
        allowNull: false, // Tidak boleh kosong
    })
    is_active!: number;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    created_at!: Date;

    @Column({
        type: DataType.DATE,
        defaultValue: DataType.NOW,
    })
    updated_at!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true, // Bisa null karena soft delete
    })
    deleted_at?: Date | null;
}

    // Removed redundant association definitions as they are already defined in ticketing.ts
