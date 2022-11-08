import {LeftPanel} from "../LeftPanel/LeftPanel";
import {CustomNavbar} from "../CustomNavbar/CustomNavbar";
import {Catalog} from "../Catalog/Catalog";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import {useCallback, useRef, useState} from "react";
import {useElasticSearch} from "../../hooks/useElasticSearch";
import {Filters} from "../Filters/Filters";

function App() {
    const [query, setQuery] = useState("");
    const [facetFilters, setFacetFilter] = useState({
        cellular_technology: "",
        memory_storage: "",
        os: "",
        brand: "",
    });
    const [page, setPage] = useState(0);

    const {searchResult, hasMore, loading, error} = useElasticSearch(
        query,
        page
    );

    const observer = useRef();
    const lastBookElementRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    //	do not remove! helpful to understand infinite scroll
                    // console.log("node", node);
                    setPage((prevPageNumber) => prevPageNumber + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <div className="app__main">
            <CustomNavbar setQuery={setQuery} setPage={setPage}/>
            <Filters setQuery={setQuery}/>
            <div className="app__main__container">
                <LeftPanel aggregations={searchResult.aggsInfo} setQuery={setQuery}/>
                <Catalog
                    items={searchResult.items}
                    loading={loading}
                    lastBookElementRef={lastBookElementRef}
                    hasMore={hasMore}
                />
            </div>
        </div>
    );
}

export default App;
