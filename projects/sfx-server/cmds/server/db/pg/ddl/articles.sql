create table articles
(
    pk varchar not null
        constraint articles_pk
            primary key,
    title varchar not null,
    body json not null,
    create_time timestamp,
    update_time timestamp,
    creator varchar not null
);

comment on table articles is '文章表';

comment on column articles.pk is '主键列';

comment on column articles.title is '标题';

comment on column articles.body is '正文';

comment on column articles.creator is '创建者';

alter table articles owner to postgres;

create unique index articles_pk_uindex
    on articles (pk);

create index articles_update_time_index
    on articles (update_time desc);

