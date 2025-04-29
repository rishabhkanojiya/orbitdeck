import React, { useEffect, useState, useCallback } from "react";
import Loader from "../Loader";
import { debounce } from "lodash";

const Pagination = ({ data, Service, children }) => {
    const [items, setItems] = useState(data?.items ?? []);
    const [currentPage, setCurrentPage] = useState(data?.page?.current ?? 1);
    const [hasNextPage, setHasNextPage] = useState(data?.page?.hasNext ?? true);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await Service({
                pageNo: currentPage,
                pageSize: 9,
            });
            const { items: newItems, page } = response.data;

            setItems((prevItems) => [...prevItems, ...newItems]);
            setHasNextPage(page.hasNext);
        } catch (err) {
            console.error("Pagination fetch failed:", err);
        } finally {
            setLoading(false);
        }
    }, [Service, currentPage]);

    const handleScroll = debounce(() => {
        const { scrollTop, scrollHeight, clientHeight } =
            document.documentElement;
        if (
            scrollTop + clientHeight >= scrollHeight - 10 &&
            hasNextPage &&
            !loading
        ) {
            setCurrentPage((prev) => prev + 1);
        }
    }, 200);

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    useEffect(() => {
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    return (
        <>
            {children({ items })}
            {loading && <Loader />}
        </>
    );
};

export default Pagination;
