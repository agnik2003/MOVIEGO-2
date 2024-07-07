import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";

import "./style.scss";

import { fetchDataFromApi } from "../../utils/api";
import ContentWrapper from "../../components/contentWrapper/ContentWrapper";
import MovieCard from "../../components/movieCard/MovieCard";
import Spinner from "../../components/spinner/Spinner";
import noResults from "../../assets/no-results.png";

const SearchResult = () => {
  const [data, setData] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [loading, setLoading] = useState(false);
  const { query } = useParams();

  const fetchInitialData = () => {
    setLoading(true);
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        const filteredResults = res.results.filter(
          (item) => !isAdultContent(item)
        );
        setData({ ...res, results: filteredResults });
        setPageNum((prev) => prev + 1);
        setLoading(false);
      }
    );
  };

  const fetchNextPageData = () => {
    fetchDataFromApi(`/search/multi?query=${query}&page=${pageNum}`).then(
      (res) => {
        const filteredResults = res.results.filter(
          (item) => !isAdultContent(item)
        );
        if (data?.results) {
          setData({
            ...data,
            results: [...data.results, ...filteredResults],
          });
        } else {
          setData({ ...res, results: filteredResults });
        }
        setPageNum((prev) => prev + 1);
      }
    );
  };

  const isAdultContent = (item) => {
    //to check whether the content is pornographic or not
    const adultKeywords = ["porn", "xxx", "adult", "kimono","hentai"];
    const title = item.title || item.name || "";
    const overview = item.overview || "";
    const isAdult = adultKeywords.some(
      (keyword) => title.toLowerCase().includes(keyword) || overview.toLowerCase().includes(keyword)
    );
    return isAdult;
  };

  useEffect(() => {
    setPageNum(1);
    fetchInitialData();
  }, [query]);

  return (
    <div className="searchResultsPage">
      {loading && <Spinner initial={true} />}
      {!loading && (
        <ContentWrapper>
          {data?.results?.length > 0 ? (
            <>
              <div className="pageTitle">
                {`Search ${
                  data?.total_results > 1 ? "results" : "result"
                } of '${query}'`}
              </div>
              <InfiniteScroll
                className="content"
                dataLength={data?.results?.length || []}
                next={fetchNextPageData}
                hasMore={pageNum <= data?.total_pages}
                loader={<Spinner />}
              >
                {data?.results.map((item, index) => {
                  if (item.media_type === "person") return;
                  return (
                    <MovieCard key={index} data={item} fromSearch={true} />
                  );
                })}
              </InfiniteScroll>
            </>
          ) : (
            <span className="resultNotFound">
              <img src={noResults} alt="No Results Found"/>
              <br />
              <div className="sorry-text">Sorry, Results not found!</div>
            </span>
          )}
        </ContentWrapper>
      )}
    </div>
  );
};

export default SearchResult;
