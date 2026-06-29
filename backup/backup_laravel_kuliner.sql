--
-- PostgreSQL database dump
--

\restrict Lgc1l3akVFUWUIi1P5I651xBFlCt1JMGoJZ3jgrl8UzwnUaDQJWle1emFqJYPSK

-- Dumped from database version 18.3 (Debian 18.3-1.pgdg13+1)
-- Dumped by pg_dump version 18.3 (Debian 18.3-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics (
    id bigint NOT NULL,
    spot_id bigint NOT NULL,
    event_type character varying(255) NOT NULL,
    ip_address character varying(255),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.analytics OWNER TO postgres;

--
-- Name: analytics_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_id_seq OWNER TO postgres;

--
-- Name: analytics_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_id_seq OWNED BY public.analytics.id;


--
-- Name: cache; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache (
    key character varying(255) NOT NULL,
    value text NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache OWNER TO postgres;

--
-- Name: cache_locks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cache_locks (
    key character varying(255) NOT NULL,
    owner character varying(255) NOT NULL,
    expiration bigint NOT NULL
);


ALTER TABLE public.cache_locks OWNER TO postgres;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: culinary_spot_tag; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.culinary_spot_tag (
    id bigint NOT NULL,
    culinary_spot_id bigint NOT NULL,
    tag_id bigint NOT NULL
);


ALTER TABLE public.culinary_spot_tag OWNER TO postgres;

--
-- Name: culinary_spot_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.culinary_spot_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.culinary_spot_tag_id_seq OWNER TO postgres;

--
-- Name: culinary_spot_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.culinary_spot_tag_id_seq OWNED BY public.culinary_spot_tag.id;


--
-- Name: culinary_spots; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.culinary_spots (
    id bigint NOT NULL,
    category_id bigint NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    latitude numeric(10,8) NOT NULL,
    longitude numeric(11,8) NOT NULL,
    price numeric(10,2) NOT NULL,
    is_promoted boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    owner_id bigint,
    status character varying(255) DEFAULT 'approved'::character varying NOT NULL,
    closed_reason character varying(255),
    submitted_by bigint
);


ALTER TABLE public.culinary_spots OWNER TO postgres;

--
-- Name: culinary_spots_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.culinary_spots_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.culinary_spots_id_seq OWNER TO postgres;

--
-- Name: culinary_spots_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.culinary_spots_id_seq OWNED BY public.culinary_spots.id;


--
-- Name: failed_jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.failed_jobs (
    id bigint NOT NULL,
    uuid character varying(255) NOT NULL,
    connection text NOT NULL,
    queue text NOT NULL,
    payload text NOT NULL,
    exception text NOT NULL,
    failed_at timestamp(0) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.failed_jobs OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.failed_jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.failed_jobs_id_seq OWNER TO postgres;

--
-- Name: failed_jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.failed_jobs_id_seq OWNED BY public.failed_jobs.id;


--
-- Name: favorites; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.favorites (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    culinary_spot_id bigint NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.favorites OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.favorites_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.favorites_id_seq OWNER TO postgres;

--
-- Name: favorites_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.favorites_id_seq OWNED BY public.favorites.id;


--
-- Name: job_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_batches (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    total_jobs integer NOT NULL,
    pending_jobs integer NOT NULL,
    failed_jobs integer NOT NULL,
    failed_job_ids text NOT NULL,
    options text,
    cancelled_at integer,
    created_at integer NOT NULL,
    finished_at integer
);


ALTER TABLE public.job_batches OWNER TO postgres;

--
-- Name: jobs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jobs (
    id bigint NOT NULL,
    queue character varying(255) NOT NULL,
    payload text NOT NULL,
    attempts smallint NOT NULL,
    reserved_at integer,
    available_at integer NOT NULL,
    created_at integer NOT NULL
);


ALTER TABLE public.jobs OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jobs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.jobs_id_seq OWNER TO postgres;

--
-- Name: jobs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jobs_id_seq OWNED BY public.jobs.id;


--
-- Name: media; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.media (
    id bigint NOT NULL,
    model_type character varying(255) NOT NULL,
    model_id bigint NOT NULL,
    uuid uuid,
    collection_name character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    file_name character varying(255) NOT NULL,
    mime_type character varying(255),
    disk character varying(255) NOT NULL,
    conversions_disk character varying(255),
    size bigint NOT NULL,
    manipulations json NOT NULL,
    custom_properties json NOT NULL,
    generated_conversions json NOT NULL,
    responsive_images json NOT NULL,
    order_column integer,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.media OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.media_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.media_id_seq OWNER TO postgres;

--
-- Name: media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;


--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    migration character varying(255) NOT NULL,
    batch integer NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    type character varying(255) NOT NULL,
    notifiable_type character varying(255) NOT NULL,
    notifiable_id bigint NOT NULL,
    data text NOT NULL,
    read_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_reset_tokens (
    email character varying(255) NOT NULL,
    token character varying(255) NOT NULL,
    created_at timestamp(0) without time zone
);


ALTER TABLE public.password_reset_tokens OWNER TO postgres;

--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    spot_id bigint NOT NULL,
    rating smallint NOT NULL,
    comment text NOT NULL,
    is_verified boolean DEFAULT false NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sessions (
    id character varying(255) NOT NULL,
    user_id bigint,
    ip_address character varying(45),
    user_agent text,
    payload text NOT NULL,
    last_activity integer NOT NULL
);


ALTER TABLE public.sessions OWNER TO postgres;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tags_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tags_id_seq OWNER TO postgres;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    spot_id bigint NOT NULL,
    order_id character varying(255) NOT NULL,
    status character varying(255) NOT NULL,
    amount numeric(12,2) NOT NULL,
    paid_at timestamp(0) without time zone,
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transactions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO postgres;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    email_verified_at timestamp(0) without time zone,
    password character varying(255) NOT NULL,
    remember_token character varying(100),
    created_at timestamp(0) without time zone,
    updated_at timestamp(0) without time zone,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL,
    avatar character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: analytics id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics ALTER COLUMN id SET DEFAULT nextval('public.analytics_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: culinary_spot_tag id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spot_tag ALTER COLUMN id SET DEFAULT nextval('public.culinary_spot_tag_id_seq'::regclass);


--
-- Name: culinary_spots id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spots ALTER COLUMN id SET DEFAULT nextval('public.culinary_spots_id_seq'::regclass);


--
-- Name: failed_jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs ALTER COLUMN id SET DEFAULT nextval('public.failed_jobs_id_seq'::regclass);


--
-- Name: favorites id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites ALTER COLUMN id SET DEFAULT nextval('public.favorites_id_seq'::regclass);


--
-- Name: jobs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs ALTER COLUMN id SET DEFAULT nextval('public.jobs_id_seq'::regclass);


--
-- Name: media id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);


--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: analytics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics (id, spot_id, event_type, ip_address, created_at, updated_at) FROM stdin;
1	1	view	114.124.200.10	2026-03-16 05:06:20	2026-04-12 00:06:20
2	1	view	103.28.12.1	2026-04-01 17:06:20	2026-04-12 00:06:20
3	1	view	202.152.30.88	2026-04-02 04:06:20	2026-04-12 00:06:20
4	1	view	36.72.15.20	2026-04-01 04:06:20	2026-04-12 00:06:20
5	1	click	202.152.30.88	2026-03-18 19:06:20	2026-04-12 00:06:20
6	1	click	202.152.30.88	2026-04-07 19:06:20	2026-04-12 00:06:20
7	1	view	103.28.12.1	2026-03-28 01:06:20	2026-04-12 00:06:20
8	1	view	114.124.200.10	2026-03-19 12:06:20	2026-04-12 00:06:20
9	1	view	103.28.12.1	2026-03-27 07:06:20	2026-04-12 00:06:20
10	1	view	103.28.12.1	2026-03-30 09:06:20	2026-04-12 00:06:20
11	1	view	202.152.30.88	2026-03-19 20:06:20	2026-04-12 00:06:20
12	1	click	114.124.200.10	2026-04-10 12:06:20	2026-04-12 00:06:20
13	1	click	202.152.30.88	2026-03-29 02:06:20	2026-04-12 00:06:20
14	1	view	103.28.12.1	2026-04-07 04:06:20	2026-04-12 00:06:20
15	1	view	114.124.200.10	2026-04-04 05:06:20	2026-04-12 00:06:20
16	1	click	114.124.200.10	2026-04-09 17:06:20	2026-04-12 00:06:20
17	1	view	36.72.15.20	2026-03-29 16:06:20	2026-04-12 00:06:20
18	1	view	180.244.128.5	2026-03-26 19:06:20	2026-04-12 00:06:20
19	1	view	36.72.15.20	2026-04-10 11:06:20	2026-04-12 00:06:20
20	1	view	202.152.30.88	2026-03-22 02:06:20	2026-04-12 00:06:20
21	1	view	36.72.15.20	2026-03-14 10:06:20	2026-04-12 00:06:20
22	1	view	180.244.128.5	2026-03-25 09:06:20	2026-04-12 00:06:20
23	1	view	114.124.200.10	2026-03-15 10:06:20	2026-04-12 00:06:20
24	1	view	36.72.15.20	2026-03-23 05:06:20	2026-04-12 00:06:20
25	1	view	36.72.15.20	2026-04-02 16:06:20	2026-04-12 00:06:20
26	1	view	36.72.15.20	2026-03-16 15:06:20	2026-04-12 00:06:20
27	1	view	114.124.200.10	2026-03-19 22:06:20	2026-04-12 00:06:20
28	1	view	202.152.30.88	2026-03-18 13:06:20	2026-04-12 00:06:20
29	1	view	103.28.12.1	2026-03-17 07:06:20	2026-04-12 00:06:20
30	1	click	202.152.30.88	2026-03-23 18:06:20	2026-04-12 00:06:20
31	1	view	180.244.128.5	2026-03-20 13:06:20	2026-04-12 00:06:20
32	1	click	202.152.30.88	2026-03-26 16:06:20	2026-04-12 00:06:20
33	1	view	36.72.15.20	2026-03-30 13:06:20	2026-04-12 00:06:20
34	1	view	180.244.128.5	2026-03-27 01:06:20	2026-04-12 00:06:20
35	1	click	114.124.200.10	2026-03-20 02:06:20	2026-04-12 00:06:20
36	1	view	202.152.30.88	2026-04-05 16:06:20	2026-04-12 00:06:20
37	1	view	180.244.128.5	2026-03-26 10:06:20	2026-04-12 00:06:20
38	1	view	202.152.30.88	2026-03-23 20:06:20	2026-04-12 00:06:20
39	1	view	36.72.15.20	2026-03-22 00:06:20	2026-04-12 00:06:20
40	1	view	180.244.128.5	2026-03-23 00:06:20	2026-04-12 00:06:20
41	1	view	114.124.200.10	2026-03-20 20:06:20	2026-04-12 00:06:20
42	1	view	36.72.15.20	2026-03-20 01:06:20	2026-04-12 00:06:20
43	1	click	36.72.15.20	2026-03-28 18:06:20	2026-04-12 00:06:20
44	1	view	103.28.12.1	2026-03-16 07:06:20	2026-04-12 00:06:20
45	1	view	103.28.12.1	2026-03-19 00:06:20	2026-04-12 00:06:20
46	1	view	36.72.15.20	2026-03-12 01:06:20	2026-04-12 00:06:20
47	2	click	36.72.15.20	2026-03-24 08:06:20	2026-04-12 00:06:20
48	2	view	36.72.15.20	2026-03-26 02:06:20	2026-04-12 00:06:20
49	2	click	180.244.128.5	2026-03-16 16:06:20	2026-04-12 00:06:20
50	2	view	180.244.128.5	2026-04-03 07:06:20	2026-04-12 00:06:20
51	2	view	36.72.15.20	2026-03-30 03:06:20	2026-04-12 00:06:20
52	2	view	36.72.15.20	2026-03-16 23:06:20	2026-04-12 00:06:20
53	2	view	114.124.200.10	2026-04-05 18:06:20	2026-04-12 00:06:20
54	2	click	114.124.200.10	2026-03-28 18:06:20	2026-04-12 00:06:20
55	2	view	103.28.12.1	2026-04-02 18:06:20	2026-04-12 00:06:20
56	2	view	114.124.200.10	2026-03-30 08:06:20	2026-04-12 00:06:20
57	2	view	202.152.30.88	2026-04-09 15:06:20	2026-04-12 00:06:20
58	2	view	36.72.15.20	2026-04-08 22:06:20	2026-04-12 00:06:20
59	2	view	36.72.15.20	2026-04-07 18:06:20	2026-04-12 00:06:20
60	2	view	36.72.15.20	2026-04-08 17:06:20	2026-04-12 00:06:20
61	2	click	202.152.30.88	2026-03-16 16:06:20	2026-04-12 00:06:20
62	2	view	103.28.12.1	2026-04-02 09:06:20	2026-04-12 00:06:20
63	2	click	114.124.200.10	2026-04-06 01:06:20	2026-04-12 00:06:20
64	2	click	114.124.200.10	2026-03-25 14:06:20	2026-04-12 00:06:20
65	2	view	180.244.128.5	2026-03-23 14:06:20	2026-04-12 00:06:20
66	2	click	103.28.12.1	2026-03-29 11:06:20	2026-04-12 00:06:20
67	2	view	36.72.15.20	2026-04-05 10:06:20	2026-04-12 00:06:20
68	2	view	202.152.30.88	2026-04-11 21:06:20	2026-04-12 00:06:20
69	2	click	114.124.200.10	2026-04-01 14:06:20	2026-04-12 00:06:20
70	2	click	180.244.128.5	2026-03-28 21:06:20	2026-04-12 00:06:20
71	2	view	114.124.200.10	2026-04-05 03:06:20	2026-04-12 00:06:20
72	2	view	114.124.200.10	2026-03-17 11:06:20	2026-04-12 00:06:20
73	2	click	202.152.30.88	2026-03-27 17:06:20	2026-04-12 00:06:20
74	2	click	103.28.12.1	2026-04-10 18:06:20	2026-04-12 00:06:20
75	2	view	114.124.200.10	2026-03-21 16:06:20	2026-04-12 00:06:20
76	2	click	103.28.12.1	2026-03-18 02:06:20	2026-04-12 00:06:20
77	2	click	103.28.12.1	2026-03-22 15:06:20	2026-04-12 00:06:20
78	2	view	114.124.200.10	2026-03-20 10:06:20	2026-04-12 00:06:20
79	2	view	180.244.128.5	2026-03-30 00:06:20	2026-04-12 00:06:20
80	2	view	36.72.15.20	2026-04-10 07:06:20	2026-04-12 00:06:20
81	2	view	114.124.200.10	2026-03-31 01:06:20	2026-04-12 00:06:20
82	2	click	114.124.200.10	2026-03-23 15:06:20	2026-04-12 00:06:20
83	2	view	103.28.12.1	2026-04-02 11:06:20	2026-04-12 00:06:20
84	2	view	114.124.200.10	2026-03-21 12:06:20	2026-04-12 00:06:20
85	2	click	36.72.15.20	2026-03-19 07:06:20	2026-04-12 00:06:20
86	2	view	36.72.15.20	2026-03-16 06:06:20	2026-04-12 00:06:20
87	2	view	103.28.12.1	2026-03-20 00:06:20	2026-04-12 00:06:20
88	2	view	202.152.30.88	2026-04-02 11:06:20	2026-04-12 00:06:20
89	2	click	103.28.12.1	2026-04-05 18:06:20	2026-04-12 00:06:20
90	2	view	180.244.128.5	2026-03-24 18:06:20	2026-04-12 00:06:20
91	2	view	114.124.200.10	2026-04-02 14:06:20	2026-04-12 00:06:20
92	2	view	36.72.15.20	2026-03-14 09:06:20	2026-04-12 00:06:20
93	2	click	180.244.128.5	2026-03-18 07:06:20	2026-04-12 00:06:20
94	2	view	180.244.128.5	2026-04-06 01:06:20	2026-04-12 00:06:20
95	3	view	114.124.200.10	2026-03-22 18:06:20	2026-04-12 00:06:20
96	3	click	103.28.12.1	2026-03-26 11:06:20	2026-04-12 00:06:20
97	3	view	36.72.15.20	2026-03-12 09:06:20	2026-04-12 00:06:20
98	3	view	202.152.30.88	2026-03-27 21:06:20	2026-04-12 00:06:20
99	3	view	103.28.12.1	2026-03-14 18:06:20	2026-04-12 00:06:20
100	3	view	103.28.12.1	2026-04-01 04:06:20	2026-04-12 00:06:20
101	3	click	202.152.30.88	2026-03-31 08:06:20	2026-04-12 00:06:20
102	3	view	103.28.12.1	2026-03-26 13:06:20	2026-04-12 00:06:20
103	3	click	36.72.15.20	2026-03-24 02:06:20	2026-04-12 00:06:20
104	3	view	36.72.15.20	2026-04-05 23:06:20	2026-04-12 00:06:20
105	3	click	103.28.12.1	2026-03-23 09:06:20	2026-04-12 00:06:20
106	3	click	202.152.30.88	2026-03-21 08:06:20	2026-04-12 00:06:20
107	3	click	114.124.200.10	2026-04-01 22:06:20	2026-04-12 00:06:20
108	3	view	103.28.12.1	2026-04-07 07:06:20	2026-04-12 00:06:20
109	3	view	36.72.15.20	2026-04-03 08:06:20	2026-04-12 00:06:20
110	3	view	114.124.200.10	2026-03-25 04:06:20	2026-04-12 00:06:20
111	3	click	180.244.128.5	2026-03-17 01:06:20	2026-04-12 00:06:20
112	3	click	36.72.15.20	2026-03-25 04:06:20	2026-04-12 00:06:20
113	3	click	202.152.30.88	2026-04-09 13:06:20	2026-04-12 00:06:20
114	3	click	114.124.200.10	2026-04-06 01:06:20	2026-04-12 00:06:20
115	3	view	103.28.12.1	2026-03-20 12:06:20	2026-04-12 00:06:20
116	3	click	114.124.200.10	2026-03-23 09:06:20	2026-04-12 00:06:20
117	3	view	36.72.15.20	2026-04-07 13:06:20	2026-04-12 00:06:20
118	3	click	114.124.200.10	2026-03-25 14:06:20	2026-04-12 00:06:20
119	3	view	103.28.12.1	2026-03-16 00:06:20	2026-04-12 00:06:20
120	3	view	36.72.15.20	2026-04-09 05:06:20	2026-04-12 00:06:20
121	3	view	103.28.12.1	2026-04-04 10:06:20	2026-04-12 00:06:20
122	3	view	36.72.15.20	2026-03-25 10:06:20	2026-04-12 00:06:20
123	3	click	202.152.30.88	2026-03-23 03:06:20	2026-04-12 00:06:20
124	3	view	36.72.15.20	2026-03-29 23:06:21	2026-04-12 00:06:21
125	3	view	114.124.200.10	2026-03-28 12:06:21	2026-04-12 00:06:21
126	3	click	36.72.15.20	2026-04-03 17:06:21	2026-04-12 00:06:21
127	3	click	202.152.30.88	2026-04-07 03:06:21	2026-04-12 00:06:21
128	3	click	202.152.30.88	2026-03-16 15:06:21	2026-04-12 00:06:21
129	3	view	202.152.30.88	2026-04-04 15:06:21	2026-04-12 00:06:21
130	3	click	103.28.12.1	2026-04-06 15:06:21	2026-04-12 00:06:21
131	3	click	114.124.200.10	2026-04-05 01:06:21	2026-04-12 00:06:21
132	3	click	36.72.15.20	2026-03-29 16:06:21	2026-04-12 00:06:21
133	3	click	103.28.12.1	2026-04-03 00:06:21	2026-04-12 00:06:21
134	3	view	180.244.128.5	2026-04-04 06:06:21	2026-04-12 00:06:21
135	4	click	114.124.200.10	2026-03-20 12:06:21	2026-04-12 00:06:21
136	4	view	114.124.200.10	2026-04-11 12:06:21	2026-04-12 00:06:21
137	4	view	202.152.30.88	2026-03-16 07:06:21	2026-04-12 00:06:21
138	4	click	114.124.200.10	2026-04-07 18:06:21	2026-04-12 00:06:21
139	4	click	180.244.128.5	2026-03-28 23:06:21	2026-04-12 00:06:21
140	4	click	103.28.12.1	2026-03-19 18:06:21	2026-04-12 00:06:21
141	4	view	103.28.12.1	2026-03-22 21:06:21	2026-04-12 00:06:21
142	4	click	103.28.12.1	2026-03-31 21:06:21	2026-04-12 00:06:21
143	4	view	36.72.15.20	2026-03-30 04:06:21	2026-04-12 00:06:21
144	4	click	180.244.128.5	2026-04-06 21:06:21	2026-04-12 00:06:21
145	4	view	180.244.128.5	2026-03-14 19:06:21	2026-04-12 00:06:21
146	4	click	180.244.128.5	2026-03-19 08:06:21	2026-04-12 00:06:21
147	4	view	103.28.12.1	2026-03-25 17:06:21	2026-04-12 00:06:21
148	4	click	36.72.15.20	2026-03-24 03:06:21	2026-04-12 00:06:21
149	4	view	180.244.128.5	2026-04-05 18:06:21	2026-04-12 00:06:21
150	4	click	114.124.200.10	2026-03-27 14:06:21	2026-04-12 00:06:21
151	4	click	36.72.15.20	2026-03-27 18:06:21	2026-04-12 00:06:21
152	4	view	103.28.12.1	2026-04-04 01:06:21	2026-04-12 00:06:21
153	4	view	180.244.128.5	2026-04-11 16:06:21	2026-04-12 00:06:21
154	4	view	103.28.12.1	2026-03-27 16:06:21	2026-04-12 00:06:21
155	4	view	180.244.128.5	2026-03-25 01:06:21	2026-04-12 00:06:21
156	4	click	202.152.30.88	2026-04-08 02:06:21	2026-04-12 00:06:21
157	4	view	103.28.12.1	2026-03-13 10:06:21	2026-04-12 00:06:21
158	4	click	36.72.15.20	2026-04-11 04:06:21	2026-04-12 00:06:21
159	5	view	202.152.30.88	2026-04-03 08:06:21	2026-04-12 00:06:21
160	5	view	202.152.30.88	2026-03-17 04:06:21	2026-04-12 00:06:21
161	5	click	114.124.200.10	2026-03-29 03:06:21	2026-04-12 00:06:21
162	5	click	202.152.30.88	2026-03-15 21:06:21	2026-04-12 00:06:21
163	5	view	114.124.200.10	2026-03-12 14:06:21	2026-04-12 00:06:21
164	5	view	114.124.200.10	2026-04-04 15:06:21	2026-04-12 00:06:21
165	5	view	180.244.128.5	2026-03-17 17:06:21	2026-04-12 00:06:21
166	5	view	36.72.15.20	2026-04-01 10:06:21	2026-04-12 00:06:21
167	5	view	36.72.15.20	2026-03-30 05:06:21	2026-04-12 00:06:21
168	5	click	103.28.12.1	2026-03-23 19:06:21	2026-04-12 00:06:21
169	5	click	202.152.30.88	2026-04-05 15:06:21	2026-04-12 00:06:21
170	5	view	202.152.30.88	2026-03-31 20:06:21	2026-04-12 00:06:21
171	5	view	114.124.200.10	2026-03-28 14:06:21	2026-04-12 00:06:21
172	5	click	103.28.12.1	2026-03-26 18:06:21	2026-04-12 00:06:21
173	5	click	103.28.12.1	2026-03-31 04:06:21	2026-04-12 00:06:21
174	5	view	180.244.128.5	2026-03-25 12:06:21	2026-04-12 00:06:21
175	5	view	180.244.128.5	2026-03-18 12:06:21	2026-04-12 00:06:21
176	5	view	114.124.200.10	2026-04-05 20:06:21	2026-04-12 00:06:21
177	5	click	114.124.200.10	2026-03-30 01:06:21	2026-04-12 00:06:21
178	5	view	114.124.200.10	2026-03-15 21:06:21	2026-04-12 00:06:21
179	5	view	114.124.200.10	2026-03-28 22:06:21	2026-04-12 00:06:21
180	5	view	114.124.200.10	2026-03-19 18:06:21	2026-04-12 00:06:21
181	5	click	114.124.200.10	2026-03-13 19:06:21	2026-04-12 00:06:21
182	5	view	114.124.200.10	2026-03-22 04:06:21	2026-04-12 00:06:21
183	6	view	180.244.128.5	2026-03-20 05:06:21	2026-04-12 00:06:21
184	6	view	180.244.128.5	2026-04-10 02:06:21	2026-04-12 00:06:21
185	6	view	202.152.30.88	2026-03-31 04:06:21	2026-04-12 00:06:21
186	6	click	103.28.12.1	2026-04-05 14:06:21	2026-04-12 00:06:21
187	6	view	202.152.30.88	2026-03-14 22:06:21	2026-04-12 00:06:21
188	6	click	180.244.128.5	2026-04-02 12:06:21	2026-04-12 00:06:21
189	6	view	36.72.15.20	2026-03-15 15:06:21	2026-04-12 00:06:21
190	6	click	202.152.30.88	2026-03-26 04:06:21	2026-04-12 00:06:21
191	6	click	103.28.12.1	2026-03-28 03:06:21	2026-04-12 00:06:21
192	6	view	36.72.15.20	2026-03-25 21:06:21	2026-04-12 00:06:21
193	6	click	36.72.15.20	2026-03-28 22:06:21	2026-04-12 00:06:21
194	6	view	103.28.12.1	2026-03-30 02:06:21	2026-04-12 00:06:21
195	6	view	202.152.30.88	2026-03-19 22:06:21	2026-04-12 00:06:21
196	6	view	103.28.12.1	2026-04-10 07:06:21	2026-04-12 00:06:21
197	6	view	180.244.128.5	2026-04-06 23:06:21	2026-04-12 00:06:21
198	6	view	202.152.30.88	2026-04-09 23:06:21	2026-04-12 00:06:21
199	6	view	202.152.30.88	2026-03-12 08:06:21	2026-04-12 00:06:21
200	6	click	202.152.30.88	2026-03-13 23:06:21	2026-04-12 00:06:21
201	6	view	114.124.200.10	2026-03-16 11:06:21	2026-04-12 00:06:21
202	6	view	114.124.200.10	2026-04-06 03:06:21	2026-04-12 00:06:21
203	6	click	202.152.30.88	2026-03-23 16:06:21	2026-04-12 00:06:21
204	6	view	180.244.128.5	2026-03-27 18:06:21	2026-04-12 00:06:21
205	6	view	36.72.15.20	2026-03-17 18:06:21	2026-04-12 00:06:21
206	6	view	202.152.30.88	2026-03-25 21:06:21	2026-04-12 00:06:21
207	6	click	114.124.200.10	2026-03-20 16:06:21	2026-04-12 00:06:21
208	6	view	180.244.128.5	2026-03-31 13:06:21	2026-04-12 00:06:21
\.


--
-- Data for Name: cache; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache (key, value, expiration) FROM stdin;
\.


--
-- Data for Name: cache_locks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cache_locks (key, owner, expiration) FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, created_at, updated_at) FROM stdin;
1	Jajanan Tradisional	2026-04-12 00:06:17	2026-04-12 00:06:17
2	Restoran Kolonial	2026-04-12 00:06:18	2026-04-12 00:06:18
3	Makanan Berkuah	2026-04-12 00:06:18	2026-04-12 00:06:18
4	Mie Khas Daerah	2026-04-12 00:06:18	2026-04-12 00:06:18
5	Nasi & Lauk	2026-04-12 00:06:19	2026-04-12 00:06:19
6	Street Food	2026-04-12 00:06:20	2026-04-12 00:06:20
\.


--
-- Data for Name: culinary_spot_tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.culinary_spot_tag (id, culinary_spot_id, tag_id) FROM stdin;
\.


--
-- Data for Name: culinary_spots; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.culinary_spots (id, category_id, name, description, latitude, longitude, price, is_promoted, created_at, updated_at, owner_id, status, closed_reason, submitted_by) FROM stdin;
1	1	Lumpia Gang Lombok	Salah satu pelopor lumpia di Semarang yang sudah ada sejak tahun 1870-an. Resep rahasia rebung yang tidak berbau pesing.	-6.97491100	110.42857400	20000.00	t	2026-04-12 00:06:17	2026-04-12 00:06:17	\N	approved	\N	\N
2	2	Toko Oen Semarang	Restoran dan toko roti bergaya kolonial Belanda yang berdiri sejak 1936, terkenal dengan es krim dan menu klasiknya.	-6.97848600	110.42152800	50000.00	t	2026-04-12 00:06:18	2026-04-12 00:06:18	\N	approved	\N	\N
3	3	Soto Bangkong	Soto ayam dengan kuah bening yang legendaris dan sudah populer sejak tahun 1950-an. Memiliki keunikan kecap produksinya sendiri.	-6.99304300	110.43577300	25000.00	f	2026-04-12 00:06:18	2026-04-12 00:06:18	\N	approved	\N	\N
4	4	Mie Kopyok Pak Dhuwur	Kuliner mie khas dengan paduan tahu, tauge, lontong dan taburan kerupuk karak gendar yang sudah ada sejak tahun 1970.	-6.98565100	110.41320000	15000.00	t	2026-04-12 00:06:18	2026-04-12 00:06:18	\N	approved	\N	\N
5	5	Nasi Gandul Pak Memet	Kuliner nasi khas Pati dengan kuah gurih dan potongan daging sapi yang empuk, beroperasi di Cipto, Semarang sejak tahun 1990.	-6.98662900	110.44103100	30000.00	f	2026-04-12 00:06:19	2026-04-12 00:06:19	\N	approved	\N	\N
6	6	Lekker Paimo	Jajanan lekker legendaris depan SMA Loyola dengan beragam varian topping unik seperti Sosis Mozarella yang sudah ada sejak 1978.	-6.97858900	110.42621100	15000.00	t	2026-04-12 00:06:20	2026-04-12 00:06:20	\N	approved	\N	\N
\.


--
-- Data for Name: failed_jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.failed_jobs (id, uuid, connection, queue, payload, exception, failed_at) FROM stdin;
\.


--
-- Data for Name: favorites; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.favorites (id, user_id, culinary_spot_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: job_batches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_batches (id, name, total_jobs, pending_jobs, failed_jobs, failed_job_ids, options, cancelled_at, created_at, finished_at) FROM stdin;
\.


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.jobs (id, queue, payload, attempts, reserved_at, available_at, created_at) FROM stdin;
1	default	{"uuid":"a76f20a0-51df-400f-85d9-f29efc8122df","displayName":"Spatie\\\\MediaLibrary\\\\Conversions\\\\Jobs\\\\PerformConversionsJob","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"deleteWhenMissingModels":true,"data":{"commandName":"Spatie\\\\MediaLibrary\\\\Conversions\\\\Jobs\\\\PerformConversionsJob","command":"O:58:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Jobs\\\\PerformConversionsJob\\":6:{s:14:\\"\\u0000*\\u0000conversions\\";O:52:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\ConversionCollection\\":2:{s:8:\\"\\u0000*\\u0000items\\";a:2:{i:0;O:42:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Conversion\\":11:{s:12:\\"\\u0000*\\u0000fileNamer\\";O:54:\\"Spatie\\\\MediaLibrary\\\\Support\\\\FileNamer\\\\DefaultFileNamer\\":0:{}s:28:\\"\\u0000*\\u0000extractVideoFrameAtSecond\\";d:0;s:16:\\"\\u0000*\\u0000manipulations\\";O:45:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Manipulations\\":1:{s:16:\\"\\u0000*\\u0000manipulations\\";a:5:{s:8:\\"optimize\\";a:1:{i:0;O:36:\\"Spatie\\\\ImageOptimizer\\\\OptimizerChain\\":3:{s:13:\\"\\u0000*\\u0000optimizers\\";a:7:{i:0;O:42:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Jpegoptim\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m85\\";i:1;s:7:\\"--force\\";i:2;s:11:\\"--strip-all\\";i:3;s:17:\\"--all-progressive\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:9:\\"jpegoptim\\";}i:1;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Pngquant\\":5:{s:7:\\"options\\";a:1:{i:0;s:7:\\"--force\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"pngquant\\";}i:2;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Optipng\\":5:{s:7:\\"options\\";a:3:{i:0;s:3:\\"-i0\\";i:1;s:3:\\"-o2\\";i:2;s:6:\\"-quiet\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"optipng\\";}i:3;O:37:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Svgo\\":5:{s:7:\\"options\\";a:1:{i:0;s:20:\\"--disable=cleanupIDs\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:4:\\"svgo\\";}i:4;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Gifsicle\\":5:{s:7:\\"options\\";a:2:{i:0;s:2:\\"-b\\";i:1;s:3:\\"-O3\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"gifsicle\\";}i:5;O:38:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Cwebp\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m 6\\";i:1;s:8:\\"-pass 10\\";i:2;s:3:\\"-mt\\";i:3;s:5:\\"-q 90\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:5:\\"cwebp\\";}i:6;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Avifenc\\":6:{s:7:\\"options\\";a:8:{i:0;s:14:\\"-a cq-level=23\\";i:1;s:6:\\"-j all\\";i:2;s:7:\\"--min 0\\";i:3;s:8:\\"--max 63\\";i:4;s:12:\\"--minalpha 0\\";i:5;s:13:\\"--maxalpha 63\\";i:6;s:14:\\"-a end-usage=q\\";i:7;s:12:\\"-a tune=ssim\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"avifenc\\";s:16:\\"decodeBinaryName\\";s:7:\\"avifdec\\";}}s:9:\\"\\u0000*\\u0000logger\\";O:33:\\"Spatie\\\\ImageOptimizer\\\\DummyLogger\\":0:{}s:10:\\"\\u0000*\\u0000timeout\\";i:60;}}s:6:\\"format\\";a:1:{i:0;s:4:\\"webp\\";}s:5:\\"width\\";a:1:{i:0;i:300;}s:6:\\"height\\";a:1:{i:0;i:300;}s:7:\\"sharpen\\";a:1:{i:0;i:10;}}}s:23:\\"\\u0000*\\u0000performOnCollections\\";a:0:{}s:17:\\"\\u0000*\\u0000performOnQueue\\";b:1;s:26:\\"\\u0000*\\u0000keepOriginalImageFormat\\";b:0;s:27:\\"\\u0000*\\u0000generateResponsiveImages\\";b:0;s:18:\\"\\u0000*\\u0000widthCalculator\\";N;s:24:\\"\\u0000*\\u0000loadingAttributeValue\\";N;s:16:\\"\\u0000*\\u0000pdfPageNumber\\";i:1;s:7:\\"\\u0000*\\u0000name\\";s:5:\\"thumb\\";}i:1;O:42:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Conversion\\":11:{s:12:\\"\\u0000*\\u0000fileNamer\\";O:54:\\"Spatie\\\\MediaLibrary\\\\Support\\\\FileNamer\\\\DefaultFileNamer\\":0:{}s:28:\\"\\u0000*\\u0000extractVideoFrameAtSecond\\";d:0;s:16:\\"\\u0000*\\u0000manipulations\\";O:45:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Manipulations\\":1:{s:16:\\"\\u0000*\\u0000manipulations\\";a:4:{s:8:\\"optimize\\";a:1:{i:0;O:36:\\"Spatie\\\\ImageOptimizer\\\\OptimizerChain\\":3:{s:13:\\"\\u0000*\\u0000optimizers\\";a:7:{i:0;O:42:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Jpegoptim\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m85\\";i:1;s:7:\\"--force\\";i:2;s:11:\\"--strip-all\\";i:3;s:17:\\"--all-progressive\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:9:\\"jpegoptim\\";}i:1;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Pngquant\\":5:{s:7:\\"options\\";a:1:{i:0;s:7:\\"--force\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"pngquant\\";}i:2;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Optipng\\":5:{s:7:\\"options\\";a:3:{i:0;s:3:\\"-i0\\";i:1;s:3:\\"-o2\\";i:2;s:6:\\"-quiet\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"optipng\\";}i:3;O:37:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Svgo\\":5:{s:7:\\"options\\";a:1:{i:0;s:20:\\"--disable=cleanupIDs\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:4:\\"svgo\\";}i:4;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Gifsicle\\":5:{s:7:\\"options\\";a:2:{i:0;s:2:\\"-b\\";i:1;s:3:\\"-O3\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"gifsicle\\";}i:5;O:38:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Cwebp\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m 6\\";i:1;s:8:\\"-pass 10\\";i:2;s:3:\\"-mt\\";i:3;s:5:\\"-q 90\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:5:\\"cwebp\\";}i:6;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Avifenc\\":6:{s:7:\\"options\\";a:8:{i:0;s:14:\\"-a cq-level=23\\";i:1;s:6:\\"-j all\\";i:2;s:7:\\"--min 0\\";i:3;s:8:\\"--max 63\\";i:4;s:12:\\"--minalpha 0\\";i:5;s:13:\\"--maxalpha 63\\";i:6;s:14:\\"-a end-usage=q\\";i:7;s:12:\\"-a tune=ssim\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"avifenc\\";s:16:\\"decodeBinaryName\\";s:7:\\"avifdec\\";}}s:9:\\"\\u0000*\\u0000logger\\";O:33:\\"Spatie\\\\ImageOptimizer\\\\DummyLogger\\":0:{}s:10:\\"\\u0000*\\u0000timeout\\";i:60;}}s:6:\\"format\\";a:1:{i:0;s:4:\\"webp\\";}s:5:\\"width\\";a:1:{i:0;i:800;}s:6:\\"height\\";a:1:{i:0;i:600;}}}s:23:\\"\\u0000*\\u0000performOnCollections\\";a:0:{}s:17:\\"\\u0000*\\u0000performOnQueue\\";b:1;s:26:\\"\\u0000*\\u0000keepOriginalImageFormat\\";b:0;s:27:\\"\\u0000*\\u0000generateResponsiveImages\\";b:0;s:18:\\"\\u0000*\\u0000widthCalculator\\";N;s:24:\\"\\u0000*\\u0000loadingAttributeValue\\";N;s:16:\\"\\u0000*\\u0000pdfPageNumber\\";i:1;s:7:\\"\\u0000*\\u0000name\\";s:6:\\"medium\\";}}s:28:\\"\\u0000*\\u0000escapeWhenCastingToString\\";b:0;}s:8:\\"\\u0000*\\u0000media\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:49:\\"Spatie\\\\MediaLibrary\\\\MediaCollections\\\\Models\\\\Media\\";s:2:\\"id\\";i:1;s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:14:\\"\\u0000*\\u0000onlyMissing\\";b:0;s:10:\\"connection\\";s:8:\\"database\\";s:5:\\"queue\\";s:0:\\"\\";s:11:\\"afterCommit\\";b:1;}","batchId":null},"createdAt":1775952378,"delay":null}	0	\N	1775952378	1775952378
2	default	{"uuid":"bc1e8a09-d066-4f7c-ad72-6ec061d12759","displayName":"Spatie\\\\MediaLibrary\\\\Conversions\\\\Jobs\\\\PerformConversionsJob","job":"Illuminate\\\\Queue\\\\CallQueuedHandler@call","maxTries":null,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":null,"retryUntil":null,"deleteWhenMissingModels":true,"data":{"commandName":"Spatie\\\\MediaLibrary\\\\Conversions\\\\Jobs\\\\PerformConversionsJob","command":"O:58:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Jobs\\\\PerformConversionsJob\\":6:{s:14:\\"\\u0000*\\u0000conversions\\";O:52:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\ConversionCollection\\":2:{s:8:\\"\\u0000*\\u0000items\\";a:2:{i:0;O:42:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Conversion\\":11:{s:12:\\"\\u0000*\\u0000fileNamer\\";O:54:\\"Spatie\\\\MediaLibrary\\\\Support\\\\FileNamer\\\\DefaultFileNamer\\":0:{}s:28:\\"\\u0000*\\u0000extractVideoFrameAtSecond\\";d:0;s:16:\\"\\u0000*\\u0000manipulations\\";O:45:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Manipulations\\":1:{s:16:\\"\\u0000*\\u0000manipulations\\";a:5:{s:8:\\"optimize\\";a:1:{i:0;O:36:\\"Spatie\\\\ImageOptimizer\\\\OptimizerChain\\":3:{s:13:\\"\\u0000*\\u0000optimizers\\";a:7:{i:0;O:42:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Jpegoptim\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m85\\";i:1;s:7:\\"--force\\";i:2;s:11:\\"--strip-all\\";i:3;s:17:\\"--all-progressive\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:9:\\"jpegoptim\\";}i:1;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Pngquant\\":5:{s:7:\\"options\\";a:1:{i:0;s:7:\\"--force\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"pngquant\\";}i:2;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Optipng\\":5:{s:7:\\"options\\";a:3:{i:0;s:3:\\"-i0\\";i:1;s:3:\\"-o2\\";i:2;s:6:\\"-quiet\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"optipng\\";}i:3;O:37:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Svgo\\":5:{s:7:\\"options\\";a:1:{i:0;s:20:\\"--disable=cleanupIDs\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:4:\\"svgo\\";}i:4;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Gifsicle\\":5:{s:7:\\"options\\";a:2:{i:0;s:2:\\"-b\\";i:1;s:3:\\"-O3\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"gifsicle\\";}i:5;O:38:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Cwebp\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m 6\\";i:1;s:8:\\"-pass 10\\";i:2;s:3:\\"-mt\\";i:3;s:5:\\"-q 90\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:5:\\"cwebp\\";}i:6;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Avifenc\\":6:{s:7:\\"options\\";a:8:{i:0;s:14:\\"-a cq-level=23\\";i:1;s:6:\\"-j all\\";i:2;s:7:\\"--min 0\\";i:3;s:8:\\"--max 63\\";i:4;s:12:\\"--minalpha 0\\";i:5;s:13:\\"--maxalpha 63\\";i:6;s:14:\\"-a end-usage=q\\";i:7;s:12:\\"-a tune=ssim\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"avifenc\\";s:16:\\"decodeBinaryName\\";s:7:\\"avifdec\\";}}s:9:\\"\\u0000*\\u0000logger\\";O:33:\\"Spatie\\\\ImageOptimizer\\\\DummyLogger\\":0:{}s:10:\\"\\u0000*\\u0000timeout\\";i:60;}}s:6:\\"format\\";a:1:{i:0;s:4:\\"webp\\";}s:5:\\"width\\";a:1:{i:0;i:300;}s:6:\\"height\\";a:1:{i:0;i:300;}s:7:\\"sharpen\\";a:1:{i:0;i:10;}}}s:23:\\"\\u0000*\\u0000performOnCollections\\";a:0:{}s:17:\\"\\u0000*\\u0000performOnQueue\\";b:1;s:26:\\"\\u0000*\\u0000keepOriginalImageFormat\\";b:0;s:27:\\"\\u0000*\\u0000generateResponsiveImages\\";b:0;s:18:\\"\\u0000*\\u0000widthCalculator\\";N;s:24:\\"\\u0000*\\u0000loadingAttributeValue\\";N;s:16:\\"\\u0000*\\u0000pdfPageNumber\\";i:1;s:7:\\"\\u0000*\\u0000name\\";s:5:\\"thumb\\";}i:1;O:42:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Conversion\\":11:{s:12:\\"\\u0000*\\u0000fileNamer\\";O:54:\\"Spatie\\\\MediaLibrary\\\\Support\\\\FileNamer\\\\DefaultFileNamer\\":0:{}s:28:\\"\\u0000*\\u0000extractVideoFrameAtSecond\\";d:0;s:16:\\"\\u0000*\\u0000manipulations\\";O:45:\\"Spatie\\\\MediaLibrary\\\\Conversions\\\\Manipulations\\":1:{s:16:\\"\\u0000*\\u0000manipulations\\";a:4:{s:8:\\"optimize\\";a:1:{i:0;O:36:\\"Spatie\\\\ImageOptimizer\\\\OptimizerChain\\":3:{s:13:\\"\\u0000*\\u0000optimizers\\";a:7:{i:0;O:42:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Jpegoptim\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m85\\";i:1;s:7:\\"--force\\";i:2;s:11:\\"--strip-all\\";i:3;s:17:\\"--all-progressive\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:9:\\"jpegoptim\\";}i:1;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Pngquant\\":5:{s:7:\\"options\\";a:1:{i:0;s:7:\\"--force\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"pngquant\\";}i:2;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Optipng\\":5:{s:7:\\"options\\";a:3:{i:0;s:3:\\"-i0\\";i:1;s:3:\\"-o2\\";i:2;s:6:\\"-quiet\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"optipng\\";}i:3;O:37:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Svgo\\":5:{s:7:\\"options\\";a:1:{i:0;s:20:\\"--disable=cleanupIDs\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:4:\\"svgo\\";}i:4;O:41:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Gifsicle\\":5:{s:7:\\"options\\";a:2:{i:0;s:2:\\"-b\\";i:1;s:3:\\"-O3\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:8:\\"gifsicle\\";}i:5;O:38:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Cwebp\\":5:{s:7:\\"options\\";a:4:{i:0;s:4:\\"-m 6\\";i:1;s:8:\\"-pass 10\\";i:2;s:3:\\"-mt\\";i:3;s:5:\\"-q 90\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:5:\\"cwebp\\";}i:6;O:40:\\"Spatie\\\\ImageOptimizer\\\\Optimizers\\\\Avifenc\\":6:{s:7:\\"options\\";a:8:{i:0;s:14:\\"-a cq-level=23\\";i:1;s:6:\\"-j all\\";i:2;s:7:\\"--min 0\\";i:3;s:8:\\"--max 63\\";i:4;s:12:\\"--minalpha 0\\";i:5;s:13:\\"--maxalpha 63\\";i:6;s:14:\\"-a end-usage=q\\";i:7;s:12:\\"-a tune=ssim\\";}s:9:\\"imagePath\\";s:0:\\"\\";s:10:\\"binaryPath\\";s:0:\\"\\";s:7:\\"tmpPath\\";N;s:10:\\"binaryName\\";s:7:\\"avifenc\\";s:16:\\"decodeBinaryName\\";s:7:\\"avifdec\\";}}s:9:\\"\\u0000*\\u0000logger\\";O:33:\\"Spatie\\\\ImageOptimizer\\\\DummyLogger\\":0:{}s:10:\\"\\u0000*\\u0000timeout\\";i:60;}}s:6:\\"format\\";a:1:{i:0;s:4:\\"webp\\";}s:5:\\"width\\";a:1:{i:0;i:800;}s:6:\\"height\\";a:1:{i:0;i:600;}}}s:23:\\"\\u0000*\\u0000performOnCollections\\";a:0:{}s:17:\\"\\u0000*\\u0000performOnQueue\\";b:1;s:26:\\"\\u0000*\\u0000keepOriginalImageFormat\\";b:0;s:27:\\"\\u0000*\\u0000generateResponsiveImages\\";b:0;s:18:\\"\\u0000*\\u0000widthCalculator\\";N;s:24:\\"\\u0000*\\u0000loadingAttributeValue\\";N;s:16:\\"\\u0000*\\u0000pdfPageNumber\\";i:1;s:7:\\"\\u0000*\\u0000name\\";s:6:\\"medium\\";}}s:28:\\"\\u0000*\\u0000escapeWhenCastingToString\\";b:0;}s:8:\\"\\u0000*\\u0000media\\";O:45:\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\":5:{s:5:\\"class\\";s:49:\\"Spatie\\\\MediaLibrary\\\\MediaCollections\\\\Models\\\\Media\\";s:2:\\"id\\";i:2;s:9:\\"relations\\";a:0:{}s:10:\\"connection\\";s:5:\\"pgsql\\";s:15:\\"collectionClass\\";N;}s:14:\\"\\u0000*\\u0000onlyMissing\\";b:0;s:10:\\"connection\\";s:8:\\"database\\";s:5:\\"queue\\";s:0:\\"\\";s:11:\\"afterCommit\\";b:1;}","batchId":null},"createdAt":1775952378,"delay":null}	0	\N	1775952378	1775952378
\.


--
-- Data for Name: media; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.media (id, model_type, model_id, uuid, collection_name, name, file_name, mime_type, disk, conversions_disk, size, manipulations, custom_properties, generated_conversions, responsive_images, order_column, created_at, updated_at) FROM stdin;
1	App\\Models\\CulinarySpot	2	1339d8fc-7d62-494a-ba7d-750e87ec9b22	photos	photo-1557142046-c704a3adf364	photo-1557142046-c704a3adf364.jpeg	image/jpeg	public	public	109538	[]	[]	[]	[]	1	2026-04-12 00:06:18	2026-04-12 00:06:18
2	App\\Models\\CulinarySpot	3	aeb66873-e02d-4ee6-b9de-12b5237f910b	photos	photo-1547592180-85f173990554	photo-1547592180-85f173990554.jpeg	image/jpeg	public	public	107587	[]	[]	[]	[]	1	2026-04-12 00:06:18	2026-04-12 00:06:18
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, migration, batch) FROM stdin;
1	0001_01_01_000000_create_users_table	1
2	0001_01_01_000001_create_cache_table	1
3	0001_01_01_000002_create_jobs_table	1
4	2026_04_11_174305_create_categories_table	1
5	2026_04_11_174306_create_culinary_spots_table	1
6	2026_04_11_174307_create_reviews_table	1
7	2026_04_11_174308_create_transactions_table	1
8	2026_04_11_174309_create_analytics_table	1
9	2026_04_11_174318_create_media_table	1
10	2026_04_11_192619_add_role_to_users_table	1
11	2026_04_11_193135_create_notifications_table	1
12	2026_04_18_232437_create_favorites_table	2
13	2026_04_19_044231_add_owner_id_to_culinary_spots_table	3
14	2026_04_27_000001_create_tags_table	4
15	2026_04_27_000002_create_culinary_spot_tag_table	4
16	2026_04_27_000003_add_status_to_culinary_spots_table	4
17	2026_05_04_193525_add_avatar_to_users_table	4
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, type, notifiable_type, notifiable_id, data, read_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: password_reset_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.password_reset_tokens (email, token, created_at) FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, spot_id, rating, comment, is_verified, created_at, updated_at) FROM stdin;
1	4	1	5	Lumpia terenak yang pernah saya coba! Kulitnya renyah, isinya melimpah. Wajib coba kalau ke Semarang.	t	2026-02-03 00:06:20	2026-04-12 00:06:20
2	5	1	4	Rasanya otentik banget, tapi antrinya lumayan panjang di akhir pekan.	t	2026-01-29 00:06:20	2026-04-12 00:06:20
3	6	1	5	Sudah turun temurun sejak nenek saya! Rasa tidak pernah berubah, tetap juara.	t	2026-02-15 00:06:20	2026-04-12 00:06:20
4	4	2	4	Bandeng prestonya empuk dan gurih. Cocok untuk oleh-oleh. Packaging rapi.	t	2026-02-01 00:06:20	2026-04-12 00:06:20
5	7	2	5	Beli untuk keluarga besar di Jakarta, semua suka! Harga sangat bersahabat.	t	2026-03-22 00:06:20	2026-04-12 00:06:20
6	5	3	5	Tahu gimbalnya mantap! Bumbu kacangnya pas, udangnya segar. Porsi besar.	t	2026-03-08 00:06:20	2026-04-12 00:06:20
7	8	3	4	Tempatnya sederhana tapi rasanya luar biasa. Harga sangat terjangkau.	t	2026-01-28 00:06:20	2026-04-12 00:06:20
8	6	3	3	Rasanya oke tapi hari itu kurang fresh udangnya. Mungkin kurang beruntung.	f	2026-03-26 00:06:20	2026-04-12 00:06:20
9	7	4	4	Wingko babatnya legit! Rasa kelapa dan gula merahnya pas. Cocok buat oleh-oleh.	t	2026-04-04 00:06:20	2026-04-12 00:06:20
10	4	4	5	Classic Semarang! Beli langsung di dekat Stasiun Tawang, masih hangat. Mantap!	t	2026-02-12 00:06:20	2026-04-12 00:06:20
11	8	5	5	View lautnya keren plus seafoodnya segar banget! Kepiting sausnya juara.	t	2026-03-01 00:06:20	2026-04-12 00:06:20
12	5	5	4	Tempatnya luas dan bersih. Ikan bakarnya enak, sambalnya nampol. Recommended!	t	2026-01-25 00:06:20	2026-04-12 00:06:20
13	6	5	4	Agak jauh dari pusat kota tapi worth it. Sunset dinner di sini romantis banget.	t	2026-03-13 00:06:20	2026-04-12 00:06:20
14	4	1	5	Gokil bang, rasa kaki 5 harga bintang 5	t	2026-04-12 00:20:38	2026-04-12 00:20:38
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sessions (id, user_id, ip_address, user_agent, payload, last_activity) FROM stdin;
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tags (id, name, slug, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, user_id, spot_id, order_id, status, amount, paid_at, created_at, updated_at) FROM stdin;
1	2	1	SFE-5O30K4YP	paid	50000.00	2026-04-10 00:06:21	2026-03-22 00:06:21	2026-04-12 00:06:21
2	3	2	SFE-6NHL8SMD	paid	150000.00	2026-03-28 00:06:21	2026-03-27 00:06:21	2026-04-12 00:06:21
3	9	4	SFE-IQRUF1VA	paid	300000.00	2026-04-05 00:06:21	2026-03-16 00:06:21	2026-04-12 00:06:21
4	2	6	SFE-3UAROXH7	paid	50000.00	2026-03-30 00:06:21	2026-03-13 00:06:21	2026-04-12 00:06:21
5	2	1	SFE-WJLTX7FV	pending	150000.00	\N	2026-04-11 00:06:21	2026-04-12 00:06:21
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, email_verified_at, password, remember_token, created_at, updated_at, role, avatar) FROM stdin;
1	Admin Semarang Food	admin@semarangfood.com	2026-04-12 00:06:15	$2y$12$O/O8EC3oYw9tCpZ3yKGwOOHMa3JFkJQyFp4bq71oNvV55OMVv94gG	\N	2026-04-12 00:06:15	2026-04-12 00:06:15	admin	\N
2	Pak Lumpia	merchant1@semarangfood.com	2026-04-12 00:06:16	$2y$12$vnFJPNEQNpeXPMq8NZiunexhXKMkgrBXg8bZQ4eaI4Le.c0vrA9bq	\N	2026-04-12 00:06:16	2026-04-12 00:06:16	merchant	\N
3	Bu Elrina	merchant2@semarangfood.com	2026-04-12 00:06:16	$2y$12$MbspHzfJISj5/pruS1wUIeQZcedE/.YETIF0f6nBvenFwXQOeRHRi	\N	2026-04-12 00:06:16	2026-04-12 00:06:16	merchant	\N
5	Siti Aminah	siti@example.com	2026-04-12 00:06:16	$2y$12$zJPDzO0mPr/2JxCwEdxBOub6Gv6nqoeYRXzTMAkBVy1qa8B9t2lDy	\N	2026-04-12 00:06:16	2026-04-12 00:06:16	user	\N
6	Andi Pratama	andi@example.com	2026-04-12 00:06:16	$2y$12$QOVNqCGQPqxgZRM85vm3wO1GVQ2nNsiTo..n.MwGtJjMfXb.zfs4C	\N	2026-04-12 00:06:16	2026-04-12 00:06:16	user	\N
7	Dewi Lestari	dewi@example.com	2026-04-12 00:06:17	$2y$12$D0vHIHEsw8Dhn9qG4YZK..iieh1j0fqB2yWw3je.VAv5tR9SfxulK	\N	2026-04-12 00:06:17	2026-04-12 00:06:17	user	\N
8	Rizky Ramadhan	rizky@example.com	2026-04-12 00:06:17	$2y$12$LevlvHPNpq30PcCZa45FC.XkmRArQruFl9Gjd4QCBafpoYI/SmTVa	\N	2026-04-12 00:06:17	2026-04-12 00:06:17	user	\N
4	Budi Santoso	budi@example.com	2026-04-12 00:06:16	$2y$12$cXgo2/l7SoRi/uQvtgfreORuC0nqvC.kZw8OR5Xfiv6Crn4kCZfkW	iL2ehgLCHlR9FpGJvRHJ7DqT0xXPp5GYSvumEyoDqFCzLJDxU1Jwnj5sfpEU	2026-04-12 00:06:16	2026-04-12 00:06:16	user	\N
9	Admin Legendaris	admin_legendaris@semarangfood.com	\N	$2y$12$IvWR2I8mX.oj4AwevK/b2utXw.KRIJC3WqKjB8VZt1V2q/iF22DiO	OFBRNJ7vLOztqylaNdUSUviWBFP1nkYklq8CNcbyQ5Q2wg7qMlOtSQvPNjEB	2026-04-12 00:06:17	2026-04-12 00:06:17	merchant	\N
\.


--
-- Name: analytics_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_id_seq', 208, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 6, true);


--
-- Name: culinary_spot_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.culinary_spot_tag_id_seq', 1, false);


--
-- Name: culinary_spots_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.culinary_spots_id_seq', 6, true);


--
-- Name: failed_jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.failed_jobs_id_seq', 1, false);


--
-- Name: favorites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.favorites_id_seq', 1, false);


--
-- Name: jobs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jobs_id_seq', 2, true);


--
-- Name: media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.media_id_seq', 2, true);


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 17, true);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 14, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tags_id_seq', 1, false);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- Name: analytics analytics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_pkey PRIMARY KEY (id);


--
-- Name: cache_locks cache_locks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache_locks
    ADD CONSTRAINT cache_locks_pkey PRIMARY KEY (key);


--
-- Name: cache cache_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cache
    ADD CONSTRAINT cache_pkey PRIMARY KEY (key);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: culinary_spot_tag culinary_spot_tag_culinary_spot_id_tag_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spot_tag
    ADD CONSTRAINT culinary_spot_tag_culinary_spot_id_tag_id_unique UNIQUE (culinary_spot_id, tag_id);


--
-- Name: culinary_spot_tag culinary_spot_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spot_tag
    ADD CONSTRAINT culinary_spot_tag_pkey PRIMARY KEY (id);


--
-- Name: culinary_spots culinary_spots_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spots
    ADD CONSTRAINT culinary_spots_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_pkey PRIMARY KEY (id);


--
-- Name: failed_jobs failed_jobs_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.failed_jobs
    ADD CONSTRAINT failed_jobs_uuid_unique UNIQUE (uuid);


--
-- Name: favorites favorites_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_pkey PRIMARY KEY (id);


--
-- Name: favorites favorites_user_id_culinary_spot_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_culinary_spot_id_unique UNIQUE (user_id, culinary_spot_id);


--
-- Name: job_batches job_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_batches
    ADD CONSTRAINT job_batches_pkey PRIMARY KEY (id);


--
-- Name: jobs jobs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jobs
    ADD CONSTRAINT jobs_pkey PRIMARY KEY (id);


--
-- Name: media media_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);


--
-- Name: media media_uuid_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_uuid_unique UNIQUE (uuid);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (email);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags tags_slug_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_slug_unique UNIQUE (slug);


--
-- Name: transactions transactions_order_id_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_order_id_unique UNIQUE (order_id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cache_expiration_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cache_expiration_index ON public.cache USING btree (expiration);


--
-- Name: cache_locks_expiration_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX cache_locks_expiration_index ON public.cache_locks USING btree (expiration);


--
-- Name: jobs_queue_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX jobs_queue_index ON public.jobs USING btree (queue);


--
-- Name: media_model_type_model_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_model_type_model_id_index ON public.media USING btree (model_type, model_id);


--
-- Name: media_order_column_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX media_order_column_index ON public.media USING btree (order_column);


--
-- Name: notifications_notifiable_type_notifiable_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notifications_notifiable_type_notifiable_id_index ON public.notifications USING btree (notifiable_type, notifiable_id);


--
-- Name: sessions_last_activity_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_last_activity_index ON public.sessions USING btree (last_activity);


--
-- Name: sessions_user_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sessions_user_id_index ON public.sessions USING btree (user_id);


--
-- Name: analytics analytics_spot_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics
    ADD CONSTRAINT analytics_spot_id_foreign FOREIGN KEY (spot_id) REFERENCES public.culinary_spots(id) ON DELETE CASCADE;


--
-- Name: culinary_spot_tag culinary_spot_tag_culinary_spot_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spot_tag
    ADD CONSTRAINT culinary_spot_tag_culinary_spot_id_foreign FOREIGN KEY (culinary_spot_id) REFERENCES public.culinary_spots(id) ON DELETE CASCADE;


--
-- Name: culinary_spot_tag culinary_spot_tag_tag_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spot_tag
    ADD CONSTRAINT culinary_spot_tag_tag_id_foreign FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: culinary_spots culinary_spots_category_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spots
    ADD CONSTRAINT culinary_spots_category_id_foreign FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: culinary_spots culinary_spots_owner_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spots
    ADD CONSTRAINT culinary_spots_owner_id_foreign FOREIGN KEY (owner_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: culinary_spots culinary_spots_submitted_by_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.culinary_spots
    ADD CONSTRAINT culinary_spots_submitted_by_foreign FOREIGN KEY (submitted_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: favorites favorites_culinary_spot_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_culinary_spot_id_foreign FOREIGN KEY (culinary_spot_id) REFERENCES public.culinary_spots(id) ON DELETE CASCADE;


--
-- Name: favorites favorites_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.favorites
    ADD CONSTRAINT favorites_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_spot_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_spot_id_foreign FOREIGN KEY (spot_id) REFERENCES public.culinary_spots(id) ON DELETE CASCADE;


--
-- Name: reviews reviews_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_spot_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_spot_id_foreign FOREIGN KEY (spot_id) REFERENCES public.culinary_spots(id) ON DELETE CASCADE;


--
-- Name: transactions transactions_user_id_foreign; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_user_id_foreign FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict Lgc1l3akVFUWUIi1P5I651xBFlCt1JMGoJZ3jgrl8UzwnUaDQJWle1emFqJYPSK

