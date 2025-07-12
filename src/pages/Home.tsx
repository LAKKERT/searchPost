'use client';
import { useEffect, useState, useRef, useCallback } from "react";
import type { Comment, Post } from "../lib/interfaces/posts";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, spring, domMax } from "framer-motion";

import { LazyMotion, domAnimation } from "motion/react"
import * as m from "motion/react-m"

import ReadingImage from '../assets/posts/reading.svg'

import { Loader } from "../components/loader";

export default function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<Post[]>([]);
    const [searchTitle, setSearchTitle] = useState<string>('');
    const [foundPosts, setFoundPosts] = useState<Post[]>([]);

    const [detailPost, setDetailPost] = useState<Post | null>(null);
    const [postsComments, setPostsComments] = useState<Comment[]>([]);

    const [isFetching, setIsFetching] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);
    const [endOfPosts, setEndOfPosts] = useState<boolean>(false);
    const [pages, setPages] = useState<number>(1);

    const listVariants = {
        visible: {
            transition: {
                staggerChildren: 0.05,
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: .95 },
        visible: { opacity: 1, scale: 1 },
    }

    useEffect(() => {
        const fetchPosts = async () => {
            fetch(`https://jsonplaceholder.typicode.com/posts?_limit=12`)
                .then(response => response.json())
                .then(json => setPosts(json))

            const timeout = setTimeout(() => {
                setIsLoading(false);
                return timeout;
            }, 300)
        };
        fetchPosts();
    }, []);

    useEffect(() => {
        const fetchNextPosts = async () => {
            fetch(`https://jsonplaceholder.typicode.com/posts?_limit=12&_page=${pages}`)
                .then(response => response.json())
                .then(json => {
                    if (json.length !== 0) {
                        setPosts(prev => [...prev, ...json])
                    }
                    setIsFetching(false);
                })
        }

        if (endOfPosts) {
            setEndOfPosts(false);
            fetchNextPosts()
        }
    }, [endOfPosts, pages])

    useEffect(() => {
        if (searchTitle.length === 0) {
            setFoundPosts(posts);
        } else {
            const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(searchTitle.toLowerCase()));
            setFoundPosts(filteredPosts);
        }
    }, [searchTitle, posts])

    const openModal = (post: Post) => {

        fetch(`https://jsonplaceholder.typicode.com/comments?postId=${post.id}`)
            .then(response => response.json())
            .then(json => {
                setPostsComments(json);
                setDetailPost(post);
            })
    }

    const lastPostRef = useCallback((node: HTMLDivElement | null) => {
        if (isFetching) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setIsFetching(true);
                setEndOfPosts(true);
                setPages(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [isFetching])

    return (
        <div className="min-w-[320px] px-2">
            {isLoading ? (
                <div className="w-full h-[100vh] flex justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <motion.div className="flex flex-col items-center justify-start gap-2">
                    <div className="max-w-[320px] w-full sm:w-1/2 sm:max-w-[768px] flex flex-col gap-2 items-center text-[#4aabce]">
                        <h1 className="text-nowrap">Search Post</h1>
                        <input type="text" className="w-full outline-none caret-[#4aabce] border-b-2 border-[#4aabce] text-center text-[#4aabce]! text-lg" onChange={(e) => setSearchTitle(e.target.value)} value={searchTitle} placeholder="Введите название" />
                    </div>

                    <LazyMotion features={domMax}>

                        <m.div
                            variants={listVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-row flex-wrap justify-center gap-3"
                        >
                            <AnimatePresence mode="popLayout">
                                {foundPosts.length > 0 ? (
                                    foundPosts.map((post) => (
                                        <m.div
                                            post-id={post.id}
                                            key={post.id}
                                            variants={itemVariants}
                                            className={`flex flex-col justify-between gap-2 w-auto max-w-[320px] h-auto p-2 bg-[#e9e9e9] rounded shadow-[10px_9px_8px_0px_rgba(34,60,80,0.2)] card`}
                                        >
                                            <div>
                                                <h2 className="text-base text-center text-balance text-[#4aabce]">{post.title}</h2>
                                                <p className="text-black text-balance text-sm line-clamp-5">{post.body}</p>
                                            </div>
                                            <div className="flex flex-row justify-between">
                                                <button className="flex justify-center items-center w-full max-w-[105px] h-[35px] p-2 text-sm text-black bg-[#a9dcef] rounded-lg cursor-pointer" onClick={() => openModal(post)}>
                                                    Комментарии
                                                </button>

                                                <Link to={`/post/${post.id}`} className="flex flex-row justify-center items-center px-2 outline-2 outline-[#4aabce] rounded-lg">
                                                    <p className="text-sm text-[#4aabce]">читать</p>
                                                    <img src={ReadingImage} alt='Читать' className="h-[35px] w-7"></img>
                                                </Link>
                                            </div>
                                        </m.div>
                                    ))
                                ) : (
                                    <div>
                                        <p className="text-black">Постов с таким названием нет</p>
                                    </div>
                                )}
                            </AnimatePresence>
                            <div ref={lastPostRef} className="h-1 w-full"></div>
                        </m.div>
                    </LazyMotion>

                    <AnimatePresence>
                        {detailPost ? (
                            <motion.div
                                initial={{ backgroundColor: 'transparent' }}
                                animate={{ backgroundColor: '#a1a0a067' }}
                                exit={{ backgroundColor: 'transparent' }}
                                transition={{
                                    duration: .3
                                }}
                                className={`fixed flex flex-col justify-center items-center left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 min-h-[100vh] min-w-[100vw] inset-0 px-2 z-30`}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: detailPost ? 1 : 0 }}
                                    exit={{ scale: .6, opacity: .0 }}
                                    transition={{
                                        duration: .3,
                                        type: spring,
                                        bounce: .3,
                                    }}
                                    className="w-full min-w-[320px] max-w-[750px] h-[450px] p-2"
                                >
                                    <button className="w-auto h-8 px-2 mb-2 rounded-lg bg-white text-[#4aabce] cursor-pointer" onClick={() => setDetailPost(null)}>Вернуться</button>
                                    <div
                                        className={`relative w-full rounded`}
                                    >
                                        <div className="relative bg-[#e9e9e9] p-2 rounded shadow-xl z-40">
                                            <h2 className="text-base text-center text-balance text-[#4aabce]">{detailPost.title}</h2>
                                            <p className="text-black text-balance text-sm">{detailPost.body}</p>
                                        </div>
                                        {postsComments.length > 0 ? (
                                            <motion.div
                                                className="relative top-[-4px] flex flex-col gap-2 bg-[#a9dcef] p-2 rounded z-30　overflow-y-scroll scroll-box"
                                            >
                                                {postsComments.map((comment) => (
                                                    <motion.div
                                                        key={comment.id}
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{
                                                            duration: .5,
                                                            type: spring,
                                                            bounce: .3,
                                                        }}
                                                        className="flex flex-col bg-[#ffffff] text-black text-balance rounded p-2"
                                                    >
                                                        <span className="text-xs text-pretty">Имя: {comment.name}</span>
                                                        <span className="text-xs text-pretty">Почта: {comment.email}</span>
                                                        <p className="text-sm">{comment.body}</p>
                                                    </motion.div>
                                                ))}
                                            </motion.div>
                                        ) : (
                                            <p className="text-black">Нету комментариев</p>
                                        )}
                                  </div>
                                </motion.div>
                            </motion.div>
                        ) : (
                            null
                        )}
                    </AnimatePresence>
                </motion.div>
            )}
        </div>
    )
}
  