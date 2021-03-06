CREATE TABLE EB_USER {
    USER_ID BIGINT(20) PRIMARY KEY AUTO_INCREMENT'主键ID',
    USER_NAME VARCHAR(60) '用户名',
    USER_PASSWORD VARCHAR(64),
    USER_EMAIL VARCHAR(100),
    USER_TYPE INT(2) '0为admin，1为游客'，
    USER_REGISTED DATETIME '注册时间',
    USER_LASTED_LOGIN DATETIME '最近登陆时间',
}COMMENT = '用户表';

CREATE TABLE EB_POSTS{
    POSTS_ID BIGINT(20) PRIMARY KEY AUTO_INCREMENT'主键ID',
    POSTS_TITLE TEXT NOT NULL DEFAULT '-',
    POSTS_CONTENT TEXT NOT NULL DEFAULT '',
}COMMENT = '文章表';

CREATE TABLE EB_TAGS(
  TAGS_ID BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  TAGS_NAME VARCHAR(56) NOT NULL DEFAULT '', 
) COMMENT = '标签表';

CREATE TABLE EB_PostsMappTags(
  MAPPER_ID INT BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
  P_ID BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'POSTS的ID',
  T_ID BIGINT(20) UNSIGNED NOT NULL DEFAULT 0 COMMENT 'TAGS的ID'
)ENGINE MyISAM CHARSET UTF8 COMMENT '文章对标签的映射表';




