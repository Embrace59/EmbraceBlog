import {Column, Entity, PrimaryGeneratedColumn, BeforeInsert} from "typeorm"

//@Entity将为此类模型创建数据库表
@Entity()
export class UserEntity{

    //主键id 列自动生成（ auto-increment）
    @PrimaryGeneratedColumn()
    id: number
    
    
    @Column()
    name: string
    
    //@Column装饰器，在数据库表中创建列
    @Column({unique:true})
    username:string

    @Column()
    email: string;

    @Column()
    password: string;

    @BeforeInsert()
    emailToLowerCase() {
        this.email = this.email.toLowerCase();
    }
    /*
        默认情况下，字符串被映射到一个 varchar(255)类型（取决于数据库类型）。 
        数字被映射到一个类似整数类型（取决于数据库类型）。
        但是我们不希望所有的列都是有限的 varchars 或整数，
        我们可以这样设置：
    */
    // @Column({
    //     length: 100,
    // })
    // name: string;

    // @Column("text")
    // description: string;

    // @Column()
    // filename: string;

    // @Column("double")
    // views: number;
}