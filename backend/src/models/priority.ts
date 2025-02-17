import { Model, Column, Table, DataType } from "sequelize-typescript";

export type PriorityEntity = {
    id?: number;
    sla: number; // Service Level Agreement dalam satuan waktu (misalnya jam)
    level: number; // Level prioritas (misalnya: "Low", "Medium", "High")
    is_active: number;
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
};

@Table({
    tableName: "priorities",
    paranoid: true, // Soft delete (pakai deleted_at)
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
})
export class Priority extends Model<PriorityEntity> {
    @Column({
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    })
    id!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false, // Tidak boleh kosong
    })
    sla!: number;

    @Column({
        type: DataType.INTEGER,
        allowNull: false, // Tidak boleh kosong
    })
    level!: number;

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
