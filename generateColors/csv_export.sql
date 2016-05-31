.headers on
.mode csv
.output user_answers_mturk.csv
select * 
from user_answers 
where user_id in (39,40,41,42,43,44,45,46,47,48,49,50,53,56,57,58,59,60,61,62,63,64,65,66,67)
 and id <> 341;
.output stdout
.q
