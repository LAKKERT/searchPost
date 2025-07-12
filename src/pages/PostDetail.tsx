'use client';

import { Link, useParams } from "react-router-dom";
import type { Comment, Post } from "../lib/interfaces/posts";
import { useEffect, useState } from "react";
import { motion, spring } from "motion/react";
import { Loader } from "../components/loader";

export default function PostDetail() {

    const params = useParams();
    const [postDetail, setPostDetail] = useState<Post>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [postIsReady, setPostIsReady] = useState<boolean>(false);

    useEffect(() => {
        const fetchPosts = async () => {
            fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}`)
                .then(response => response.json())
                .then(json => setPostDetail(json))

            fetch(`https://jsonplaceholder.typicode.com/posts/${params.id}/comments`)
                .then(response => response.json())
                .then(json => setComments(json))

            const timeout = setTimeout(() => {
                setIsLoading(false);
                return timeout;
            }, 300)
            setPostIsReady(true);
        };

        fetchPosts();
    }, [params]);

    return (
        <div>
            {isLoading ? (
                <div className="w-full h-[100vh] flex justify-center items-center">
                    <Loader />
                </div>
            ) : (
                <div>
                    {postDetail ? (
                        <motion.div
                            className={`relative w-full min-w-[320px] max-w-[750px] h-[450px] rounded p-2`}
                        >
                            <Link to={'/'} className="w-auto h-2 p-2 mb-2 rounded-lg bg-white text-[#4aabce]! cursor-pointer">Вернуться</Link>
                            <div className="relative bg-[#FFFFFF] p-2 rounded shadow-xl z-40">
                                <h2 className="text-base text-center text-balance text-[#4aabce]">{postDetail.title}</h2>
                                <p className="text-black text-balance text-sm">{postDetail.body}</p>
                            </div>
                            {postIsReady && comments.length !== 0 ? (
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: postIsReady ? 'auto' : 0 }}
                                    transition={{
                                        duration: 1
                                    }}
                                    className="relative top-[-4px] flex flex-col gap-2 bg-[#a9dcef] p-2 rounded z-30 overflow-y-scroll scroll-box"
                                >
                                    {comments.map((comment) => (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                duration: .5,
                                                type: spring,
                                                bounce: .3,
                                            }}
                                            className="flex flex-col bg-[#ffffff] text-black text-balance rounded p-2"
                                        >
                                            <span className="text-xs">{comment.name}</span>
                                            <span className="text-xs">{comment.email}</span>
                                            <p className="text-sm">{comment.body}</p>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <p className="text-black">Нету комментариев</p>
                            )}
                        </motion.div>
                    ) : (
                        <div>
                            <p className="text-black">Данного поста не существует</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}