"use client";

import SingleNewsDetails from "@/components/singleNews/SingleNewsDetails";
import NotFoundBody from "@/ui/notFoundBody/NotFoundBody";
import ThreeDotsLoader from "@/ui/threeDotsLoader/ThreeDotsLoader";
import instance from "@/utils/instance";
import { useParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import notFoundImg from "@/public/images/not-found.png";
export default function SinglePost() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(0);
  const [relatedItems, setRelatedItems] = useState<any>([]);

  const param = useParams();
  const slug = param.slug;

  /**
   * Fetch Data from API.
   *
   * This function fetches data from the API based on the given search title. It sets loading state
   * to indicate the ongoing data retrieval process. Upon successful API response with status code 200,
   * it updates the state with the fetched data. If it's the first page (page === 0), it sets the related
   * items and appends the data to the items array. Additionally, it increments the page number for
   * subsequent pagination. If there's an error during the API call, the error state is updated.
   *
   * @param {any} search_title - The search title used to retrieve specific data from the API.
   */
  const fetchData = async (search_title: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await instance.get(`/post-detail/${search_title}`);

      if (data.code === 200) {
        if (page === 0) {
          setRelatedItems(data.data.relatedPost);
        }
        setItems((prevItems) => [...prevItems, { ...data.data }]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Infinite Scroll Behavior.
   *
   * This function is triggered when the user scrolls to the bottom of the page. It checks if the
   * user has reached the bottom of the page and if the loading state is not active. If both conditions
   * are met, it triggers the fetchData function to load more data, passing the title of the related item
   * from the appropriate page for pagination.
   */
  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      isLoading
    ) {
      return;
    }
    fetchData(relatedItems[page - 1].encode_titl);
  };

  useEffect(() => {
    if (page < relatedItems.length + 1) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, page, relatedItems.length]);

  useEffect(() => {
    fetchData(slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // decide what to render
  //@TODO: When the error occurred
  if (error)
    return <NotFoundBody title={`${error.message}`} img={notFoundImg} />;

  //@TODO: When the loading
  if (isLoading && page === 0)
    return <ThreeDotsLoader clss={"h-[300px] sm:h-[600px]"} color="51c27c" />;

  return (
    <div>
      {items.slice(0, 1).map((itm, i) => (
        <SingleNewsDetails key={i} data={itm} clss="mt-[60px]" />
      ))}

      {items.slice(1).map((itm, i) => (
        <Fragment key={i}>
          <div className="h-10  my-10" />
          <SingleNewsDetails data={itm} clss="mt-[60px]" />
        </Fragment>
      ))}

      {isLoading && (
        <div className="w-full text-center mt-10">
          <ThreeDotsLoader clss={""} color="" />
        </div>
      )}
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}