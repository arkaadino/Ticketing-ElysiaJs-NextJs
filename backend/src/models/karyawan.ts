import { Model, Column, Table, DataType } from "sequelize-typescript";
import { Priority } from "./priority";

export type KaryawanEntity = {
    id?: number;
    id_priorities?: number;
    nik: number;
    name: string;
    position: string;
    unit_kerja: string;
    job_title: string;
    role: "admin" | "employee";
    password?: string;
    is_active: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
};

@Table({
    tableName: "karyawans",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
})
export class Karyawan extends Model<KaryawanEntity> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.INTEGER,
        references: {
            model: Priority,
            key: "id",
        },
        allowNull: false,
    })
    id_priorities!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    nik!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    position!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    unit_kerja!: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    job_title!: string;

    @Column({
        type: DataType.ENUM("admin", "employee"),
        allowNull: false,
        defaultValue: "employee",
    })
    role!: "admin" | "employee";

    @Column({
        type: DataType.STRING,
        allowNull: true,
    })
    password!: string;

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
        allowNull: true,
    })
    deleted_at!: Date | null;

    // Method untuk verifikasi password
    async verifyPassword(inputPassword: string): Promise<boolean> {
        if (!this.password) return false;
        return await Bun.password.verify(inputPassword, this.password);
    }
}

// Hook untuk hashing password sebelum menyimpan data
