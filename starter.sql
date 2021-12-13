create database Blogs
use Blogs

drop table comment

create table Blog_user(
	user_name varchar(30) primary key,
	f_name char(10) not null,
	l_name char(15),
	date_of_birth date not null,
	gender char(1),
	bio char(255),
	password varchar(50) not null
)

create table Relation(
	r_follower varchar (30) not null foreign key references Blog_user(user_name),
	r_following varchar (30) not null foreign key references Blog_user(user_name),
	r_accepted char(1) not null default 'NO'
)

create table Post(
	p_id varchar(30) primary key,
	user_name varchar (30) not null foreign key references Blog_user(user_name),
	p_timestamp DATETIME DEFAULT current_timestamp,
	p_title char(255) not null,
	p_content char(255)
)


create table comment(
	c_id varchar(30) primary key,
	c_content char(255) not null,
	c_timestamp DATETIME DEFAULT current_timestamp,
	user_name varchar (30) not null foreign key references Blog_user(user_name),
	p_id varchar (30) not null foreign key references Post(p_id)
)

create table likes(
	l_timestamp DATETIME DEFAULT current_timestamp,
	user_name varchar (30) not null foreign key references Blog_user(user_name),
	p_id varchar (30) not null foreign key references Post(p_id),
	CONSTRAINT uq_likes UNIQUE(user_name, p_id)
)

drop table likes

select r_follower, f_name, l_name, bio, user_name from relation, Blog_user 
                                    where (r_following = 'GKL28EFB2KQ' and r_accepted = 'N' and Blog_user.user_name = r_follower)


select * from Post

Select * from Post,Blog_user where ('CGJ84NIE8NU' = post.user_name and 'CGJ84NIE8NU' = Blog_user.user_name ) 
select * from Post where user_name in (select r_following from Relation where(r_follower = 'CGJ84NIE8NU' ))
select * from Post, Blog_user where post.user_name in (select r_following from Relation where(r_follower = 'CGJ84NIE8NU' ) and Post.user_name = Blog_user.user_name) 

insert into Relation values ('Aliahemen','CGJ84NIE8NU', 'Y')


insert into likes (user_name, p_id)
            values ('CGJ84NIE8NU',
                    'c6jbWAQjtt')

select * from relation where(r_following = 'HYI13EIO6FB ' and r_follower = 'CGJ84NIE8NU' and r_accepted = 'Y')

select * from relation
select * from Blog_user 
select r_following, f_name, l_name, bio, user_name from relation, Blog_user
where (r_follower = 'CGJ84NIE8NU' and r_accepted = 'Y' and Blog_user.user_name = r_following)
