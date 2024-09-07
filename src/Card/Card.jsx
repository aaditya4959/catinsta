import React, { useEffect, useState, useRef, useCallback } from "react";

export default function InfiniteScrollCats() {
    const [cats, setCats] = useState([]); // State to store the list of cats
    const [page, setPage] = useState(0); // State to keep track of the page
    const loader = useRef(null); // Ref for the loader element to detect scrolling

    const url = `https://api.thecatapi.com/v1/images/search?limit=5&page=${page}&include_breeds=true`;
    const api = "live_LlXpYuCOMOCtzFieN2VuY6D8X4d7d29oLytaexzkHtl86Ibi3ksu6ZxOcfZLkvb4";

    // Fetch the next set of cat images
    const fetchCats = useCallback(() => {
        fetch(url, {
            headers: { "x-api-key": api }
        })
        .then(response => response.json())
        .then((data) => {
            setCats((prevCats) => [...prevCats, ...data]); // Append new data to existing cats
        })
        .catch((error) => console.log("Error fetching the images", error));
    }, [url]);

    useEffect(() => {
        fetchCats(); // Fetch initial set of cats
    }, [page, fetchCats]);

    // Intersection observer to detect when user has scrolled to the bottom
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prevPage) => prevPage + 1); // Increment the page to load more cats
            }
        }, { threshold: 1.0 });

        if (loader.current) {
            observer.observe(loader.current);
        }

        return () => {
            if (loader.current) {
                observer.unobserve(loader.current);
            }
        };
    }, []);

    return (
        <div className="p-4">
            <div className="grid grid-cols-1 gap-4">
                {cats.map((cat, index) => (
                    <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white w-64">
                        <div className="w-full h-64 bg-gray-200">
                            {cat.url ? (
                                <img
                                    src={cat.url}
                                    alt="A cute cat"
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <p className="text-center">Loading...</p>
                            )}
                        </div>
                        <div className="mt-4">
                            <h3 className="text-xl font-bold">
                                {cat.breeds && cat.breeds.length > 0
                                    ? `Breed: ${cat.breeds[0].name}`
                                    : `Cat Image ID: ${cat.id}`}
                            </h3>
                            <p className="text-gray-600">
                                {cat.breeds && cat.breeds.length > 0
                                    ? cat.breeds[0].description
                                    : "This is a cute cat fetched from the API!"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Loader for infinite scroll */}
            <div ref={loader} className="text-center p-4">
                <p>Loading more cats...</p>
            </div>
        </div>
    );
}
