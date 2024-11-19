import React, {useEffect, useState} from "react";
import axios from "axios";
import { maxItemsPerPage, productsPath } from "../utils/staticData";
import {Box, CircularProgress, Container, Dialog, DialogContent, DialogTitle, Grid2, IconButton, InputAdornment, Pagination, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@mui/material";
import ClearIcon from "@mui/icons-material/clear";
import "../css/productsTable.css";

function ProductsTable() {
    const[products, setProducts] = useState([]);
    const[filteredProducts, setFilteredProducts] = useState([]);
    const[searchQuery, setSearchQuery] = useState("");
    const[isLoading, setIsLoading] = useState(true);
    const[error, setError] = useState(null);
    const[page, setPage] = useState(1);
    const[isSearchLoading, setIsSearchLoading] = useState(false);
    const[selectedRow, setSelectedRow] = useState(null);
    const[openModal, setOpenModal] = useState(false);

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

    const rowClickHandler = (data) => {
        setSelectedRow(data);
        setOpenModal(true);
    }

    const closeModalHandler = () => {
        setOpenModal(false);
        setSelectedRow(null);
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


    return <div className="products-div">
        <Typography className="productsTableLabel" variant="h6" gutterBottom>PRODUCTS DEMO</Typography>
        <Container className="products-container">
            <TextField className="productsTableSearchField" placeholder="Search product"  variant="outlined" value={searchQuery} onChange={searchEventHandler} slotProps={{ input:{ 
                endAdornment:(searchQuery && (<InputAdornment position="end"> <IconButton onClick={clearSearchHandler}><ClearIcon/></IconButton></InputAdornment>))}
            }} sx={{width: "100%", marginLeft:0, paddingTop:3, paddingBottom:3, marginRight:0}}/>
            <Table className="productsTable">
                <TableHead className="productsHead">
                    <TableRow>
                        <TableCell sx={{border:1}} className="product-header">Thumbnail</TableCell>
                        <TableCell sx={{border:1}} className="t-header">Name</TableCell>
                        <TableCell sx={{border:1}} className="t-header">Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody className="productsBody">
                    { isSearchLoading ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                <CircularProgress size={24} style={{marginRight: "10px"}} />
                                <Typography>Searching...</Typography>
                            </TableCell>
                        </TableRow>) : currentPage.length > 0 ? ( currentPage.map((data) => {
                            return <TableRow key={data.id} onClick={()=>{rowClickHandler(data)}} >
                            <TableCell>
                                <img alt={data.title} src={data.thumbnail} style={{width: 100, height: 100}}/>
                            </TableCell>
                            <TableCell className="tb-name">{data.title}</TableCell>
                            <TableCell className="tb-price">₱ {data.price}</TableCell>
                        </TableRow>}
                        )
                       
                        ) : (
                            <TableRow className="tb-empty">
                                <TableCell colSpan={3} align="center">
                                    No products matched your search keyword.
                                </TableCell>
                            </TableRow>)
                    }
                </TableBody>
            </Table>

            <Pagination count={Math.ceil(filteredProducts.length/maxItemsPerPage)} page={page} onChange={pageChangeHandler} />

            <Dialog open={openModal} onClose={closeModalHandler} className="propductModal">
                <DialogTitle>
                    <IconButton edge="end" onClick={closeModalHandler} className="closeModal"><ClearIcon/></IconButton>
                </DialogTitle>
                <DialogContent className="modalContainer">
                    {selectedRow && (
                        <Box sx={{padding:1}}>
                            <Typography sx={{padding:1}} className="modalCategory" variant="h5">{selectedRow.category}</Typography>
                            <Typography sx={{padding:1}} className="modal" variant="h4">{selectedRow.title}</Typography>
                            <Typography sx={{padding:1}} className="modal"variant="body1" component="p">{selectedRow.description}</Typography>
                            <Typography sx={{padding:1}} className="modal"variant="h6">₱ {selectedRow.price}</Typography>
                            <Typography sx={{padding:1}} className="modal"variant="h5">More Images</Typography>
                            <Grid2 container spacing={2} sx={{padding:1}}>
                                {selectedRow.images && selectedRow.images.map((value, index) => (
                                    <Grid2 item xs={4} key={index}>
                                        <img src={value} style={{width: 100, height: 100}}/>
                                    </Grid2>))
                                }
                            </Grid2>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

        </Container>
    </div>
}

export default ProductsTable;