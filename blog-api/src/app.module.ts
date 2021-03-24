import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from '@nestjs/config'
import {TypeOrmModule} from '@nestjs/typeorm'
import { UserModule } from './user/user.module';
import {AuthModule} from './auth/auth.module'
/**
 * @ 开头表示这是装饰器，是对下面的class的装饰
 * @ Module指这个class是一个module
 * module 是nestjs中的概念
 * 
 * imports -> AppModule这个module也可以通过imports来引入其他的module
 * contorller -> 类似于路由
 * providers -> 和依赖注入相关
 */
@Module({
  imports: [
    ConfigModule.forRoot({isGlobal:true}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities:true,
      synchronize:true
    }),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

