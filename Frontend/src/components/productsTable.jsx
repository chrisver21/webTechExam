import React, {useEffect, useState} from "react";
import axios from "axios";
import { productsPath } from "../utils/staticStrings";
import {Container, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography} from "@mui/material";

function ProductsTable() {
    const[products, setProducts] = useState([]);
    const[filteredProducts, setFilteredProducts] = useState([]);
    const[searchQuery, setSearchQuery] = useState("");
    const[isLoading, setIsLoading] = useState(true);
    const[error, setError] = useState(null);

    useEffect(()=>{
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

        const results = products.filter((data) => data.title.toLowerCase().includes(query.toLowerCase()));
        setFilteredProducts(results);
    }

    if(isLoading) {
        return <div>Loading....</div>;
    }

    if(error) {
        return <div>Error: {error}</div>;
    }


    return <div>
        <Container>
            <Typography variant="h4" gutterBottom>Products Demo</Typography>
            <TextField label="Search product" variant="outlined" value={searchQuery} onChange={searchEventHandler}/>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Thumbnail</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody></TableBody>
            </Table>

        </Container>
    </div>
}

export default ProductsTable;