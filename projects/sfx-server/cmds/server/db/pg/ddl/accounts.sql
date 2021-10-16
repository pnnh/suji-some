create table accounts
(
    pk varchar not null
        constraint accounts_pk
        primary key,
    create_time timestamp not null,
    update_time timestamp not null,
    uname varchar not null,
    upass varchar not null,
    image varchar
);

comment on table accounts is '账户表';

comment on column accounts.pk is '主键列';

comment on column accounts.uname is '用户名，邮箱地址，唯一';

comment on column accounts.upass is '密码';

comment on column accounts.image is 'TOTP对应的二维码，Base64编码的PNG图片';

alter table accounts owner to postgres;

create unique index accounts_pk_uindex
    on accounts (pk);

create unique index accounts_uname_uindex
    on accounts (uname);

