import { Model, Column, DataType, Table, PrimaryKey } from "sequelize-typescript"; 
import { Status } from "./statuses";
import { Category } from "./categories";
import { Karyawan } from "./karyawan";
import { Eskalasi } from "./eskalasi";

export type TicketingEntity = {
    id?: number;
    id_karyawans?: number;
    id_categories?: number;
    id_statuses?: number;
    id_eskalasi?: number;
    keluhan?: string;
    tanggal_keluhan?: Date;
    response: string | null;
    mulai_pengerjaan: Date | null;
    selesai_pengerjaan: Date | null;
    waktu_pengerjaan: Date | null;
    is_active: number;
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
        defaultValue: 3,
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
        type: DataType.INTEGER,
        references: {
            model: Eskalasi,
            key: "id",
        },
        allowNull: false 
    }) 
    id_eskalasis!: number | null;
    
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
        allowNull: true, // Tidak boleh kosong
    })
    response!: string | null;

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
        allowNull: false,
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
