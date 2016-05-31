create table user_answers(id,vis_set_id,answer,user_id,created_at,updated_at,given_sequence,given_sequence_points,answer_points,answer_type,justification,tag11,tag2,tag3,tag4);
.mode csv
.import user_answers_mturk_tagged.csv user_answers
create table tag_aggregation as select tag1, count(*) tag1_cnt from user_answers group by tag1;
insert into  tag_aggregation select tag2, count(*) tag2_cnt from user_answers group by tag2;
insert into  tag_aggregation select tag3, count(*) tag3_cnt from user_answers group by tag3;
insert into  tag_aggregation select tag4, count(*) tag4_cnt from user_answers group by tag4;


select tag1, sum(tag1_cnt) tot_cnt from tag_aggregation group by tag1 order by tot_cnt desc;