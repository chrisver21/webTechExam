import React, {useEffect, useState} from "react";
import axios from "axios";
import { maxItemsPerPage, productsPath } from "../utils/staticData";
import {CircularProgress, Container, IconButton, InputAdornment, Pagination, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@mui/material";
import ClearIcon from "@mui/icons-material/clear"

function ProductsTable() {
    const[products, setProducts] = useState([]);
    const[filteredProducts, setFilteredProducts] = useState([]);
    const[searchQuery, setSearchQuery] = useState("");
    const[isLoading, setIsLoading] = useState(true);
    const[error, setError] = useState(null);
    const[page, setPage] = useState(1);
    const[isSearchLoading, setIsSearchLoading] = useState(false);

    useEffect(()=>{
        setIsLoading(true);
        axios.get(productsPath).then((res)=>{
            setProducts(res.data);
            setFilteredProducts(res.data)
            setIsLoading(false);
        }).catch((err) =>{
            setError(err.message);
            setIsLoading(false);
        })
    },[]);

    const searchEventHandler = (event) => {
        const query = event.target.value;
        setSearchQuery(query);
        setIsSearchLoading(true);

        setTimeout(()=> {
            const results = products.filter((data) => data.title.toLowerCase().includes(query.toLowerCase()));
            setFilteredProducts(results);
            setIsSearchLoading(false);
            setPage(1);
        }, 500);
    }

    const pageChangeHandler = (event, value) => {
        setPage(value);
    }

    const clearSearchHandler = () => {
        setSearchQuery("");
        setFilteredProducts(products);
        setPage(1);
    }

    const lastProductIdx = page * maxItemsPerPage;
    const firstProductIdx = lastProductIdx - maxItemsPerPage;
    const currentPage = filteredProducts.slice(firstProductIdx, lastProductIdx);

    if(isLoading) {
        return <div><CircularProgress /></div>;
    }

    if(error) {
        return <div>Error: {error}</div>;
    }


    return <div>
        <Container>
            <Typography variant="h4" gutterBottom>Products Demo</Typography>
            <TextField placeholder="Search product"  variant="outlined" value={searchQuery} onChange={searchEventHandler} slotProps={{ input:{ 
                endAdornment:(searchQuery && (<InputAdornment position="end"> <IconButton onClick={clearSearchHandler}><ClearIcon/></IconButton></InputAdornment>))}
            }}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Thumbnail</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    { isSearchLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                <CircularProgress size={24} style={{marginRight: "10px"}} />
                                <Typography>Searching...</Typography>
                            </TableCell>
                        </TableRow>) : currentPage.length > 0 ? ( currentPage.map((data) => {
                            return <TableRow key={data.id}>
                            <TableCell>
                                <img alt={data.title} src={data.thumbnail} style={{width: 100, height: 100}}/>
                            </TableCell>
                            <TableCell>{data.title}</TableCell>
                            <TableCell>₱ {data.price}</TableCell>
                        </TableRow>}
                        )
                       
                        ) : (
                            <TableRow>
                            <TableCell colSpan={3} align="center">
                                No products matched your search keyword.
                            </TableCell>
                        </TableRow>)
                    }
                </TableBody>
            </Table>

            <Pagination count={Math.ceil(filteredProducts.length/maxItemsPerPage)} page={page} onChange={pageChangeHandler} />

        </Container>
    </div>
}

export default ProductsTable;