create table organizations
(
    pk varchar not null
        constraint organizations_pk
            primary key,
    title varchar not null,
    description varchar,
    create_time timestamp not null,
    update_time timestamp not null
);

comment on table organizations is '组织';

comment on column organizations.pk is '组织key';

comment on column organizations.title is '组织名称';

comment on column organizations.description is '描述';

alter table organizations owner to postgres;

create unique index organizations_id_uindex
    on organizations (pk);

