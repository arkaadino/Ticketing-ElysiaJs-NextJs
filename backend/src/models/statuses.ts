import { Model, Column, Table, DataType } from "sequelize-typescript";

export type StatusEntity = {
    id?: number;
    name: string;
    is_active: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
};

@Table({
    tableName: "statuses",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    paranoid: true, // Soft delete (pakai deleted_at)
})
export class Status extends Model<StatusEntity> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false, // Tidak boleh kosong
    })
    name!: string;

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
        defaultValue: DataType.NOW, // Tanpa `onUpdate`
    })
    updated_at!: Date;

    @Column({
        type: DataType.DATE,
        allowNull: true, // Bisa null karena soft delete
    })
    deleted_at?: Date | null;
}

