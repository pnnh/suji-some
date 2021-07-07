create table quests
(
    pk varchar not null
        constraint quests_pk
            primary key,
    priority integer default 0 not null,
    title varchar not null,
    executor varchar not null,
    creator varchar not null,
    project varchar not null,
    tags varchar,
    parent varchar not null,
    create_time timestamp,
    update_time timestamp,
    status varchar,
    organization varchar not null,
    description varchar
);

comment on table quests is '任务表';

comment on column quests.pk is '任务key';

comment on column quests.priority is '优先级';

comment on column quests.title is '标题';

comment on column quests.executor is '执行者';

comment on column quests.creator is '创建者';

comment on column quests.project is '所属项目';

comment on column quests.tags is '标签，以英文逗号分隔';

comment on column quests.parent is '父任务id';

comment on column quests.update_time is '更新时间';

comment on column quests.status is '任务状态';

comment on column quests.organization is '组织id';

comment on column quests.description is '描述';

alter table quests owner to postgres;

create unique index quests_id_uindex
    on quests (pk);

