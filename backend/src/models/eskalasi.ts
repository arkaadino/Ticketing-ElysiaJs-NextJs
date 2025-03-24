    import { Model, Column, Table, DataType, BeforeSave } from "sequelize-typescript";

    export type EskalasiEntity = {
        id?: number;
        nik: number;
        name: string;
        position: string;
        unit_kerja: string;
        job_title: string;
        password?: string;
        is_active: number;
        created_at?: Date;
        updated_at?: Date;
        deleted_at?: Date | null;
    };

    @Table({
        tableName: "eskalasis",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        deletedAt: "deleted_at",
    })
    export class Eskalasi extends Model<EskalasiEntity> {
        @Column({
            type: DataType.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        })
        id!: number;

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
            type: DataType.STRING,
            allowNull: true,
            set(value: string) {
              // Jika ada nilai password baru, hash terlebih dahulu
              if (value) {
                // Gunakan Bun.password.hashSync jika tersedia, atau gunakan cara async dengan setter
                const hashedPassword = Bun.password.hashSync(value);
                this.setDataValue('password', hashedPassword);
              }
            }
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

    
