create table roles
(
    pk varchar not null
        constraint roles_pk
            primary key,
    title varchar not null,
    create_time timestamp not null,
    update_time timestamp not null
);

comment on table roles is '角色表';

comment on column roles.pk is '主键列';

comment on column roles.title is '名称标题';

alter table roles owner to postgres;

create unique index roles_pk_uindex
    on roles (pk);

