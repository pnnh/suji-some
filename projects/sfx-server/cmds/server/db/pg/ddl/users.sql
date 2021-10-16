create table public.users
(
    pk varchar not null
        constraint users_pk
            primary key,
    title varchar not null,
    description varchar,
    create_time timestamp not null,
    update_time timestamp not null,
    organization varchar not null
);

comment on table public.users is '用户表';

comment on column public.users.pk is '主键列';

comment on column public.users.title is '个人名称';

comment on column public.users.description is '个人描述';

comment on column public.users.create_time is '创建时间';

comment on column public.users.update_time is '更新时间';

comment on column public.users.organization is '组织';

alter table public.users owner to postgres;

create unique index users_key_uindex
    on public.users (pk);

