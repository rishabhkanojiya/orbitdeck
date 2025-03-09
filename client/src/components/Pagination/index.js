import React, { useEffect, useRef, useState } from "react";
import Loader from "../Loader";
import { debounce } from "lodash";

const Pagination = ({ data, Service, children }) => {
    const [items, setItems] = useState(data?.items ?? []);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(true);

    const fetchData = async () => {
        try {
            const response = await Service({ pageNo: currentPage });
            const { items, page } = response.data;
            setItems((prevItems) => [...prevItems, ...items]);
            setCurrentPage(page.current);
            setHasNextPage(page.hasNext);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const handleScroll = () => {
        const { scrollTop, clientHeight, scrollHeight } =
            document.documentElement;

        if (scrollTop + clientHeight >= scrollHeight) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    useEffect(() => {
        data?.page?.current != currentPage && hasNextPage && fetchData();
    }, [currentPage]);

    useEffect(() => {
        const debounceScroll = debounce(handleScroll, 200);

        window.addEventListener("scroll", debounceScroll);

        return () => {
            window.removeEventListener("scroll", debounceScroll);
        };
    }, []);

    return (
        <>
            {children({ items })}

            {hasNextPage && <Loader />}
        </>
    );
};

export default Pagination;
