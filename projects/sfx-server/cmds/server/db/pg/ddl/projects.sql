create table projects
(
    pk varchar not null
        constraint projects_pk
            primary key,
    title varchar not null,
    description varchar,
    ower integer not null,
    create_time timestamp not null,
    update_time timestamp not null,
    organization varchar not null
);

comment on table projects is '项目表';

comment on column projects.pk is '项目key';

comment on column projects.title is '项目标题';

comment on column projects.description is '项目描述';

comment on column projects.ower is '项目所有者id';

comment on column projects.create_time is '创建时间';

comment on column projects.update_time is '最后更新时间';

comment on column projects.organization is '项目所属的组织';

alter table projects owner to postgres;

create unique index projects_id_uindex
    on projects (pk);

