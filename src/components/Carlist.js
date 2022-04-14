import React, {useState, useEffect} from 'react';

import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

import Addcar from './Addcar';
import { Add } from '@mui/icons-material';
import Editcar from './Editcar';

function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    
    useEffect(()=>{
         fetchCars();  
    }, []);

    const fetchCars =()=>{
        fetch(process.env.REACT_APP_API_URL)
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (link) => {
    console.log(link);
    if(window.confirm('Are you sure?')){
        fetch(link, {method: 'DELETE'})
        .then(response=>{
            if(!response.ok){
              alert('Something went wrong in deletion'); 
            }
            else{
                setMessage('Car successfully deleted!')
                setOpen(true);
                fetchCars();
            }
        })
        .catch(err=> console.error(err))
    }
    
}
    const addCar =(newCar)=>{
        fetch(process.env.REACT_APP_API_URL, {
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newCar)
        })
        .then(response=>{
            if(!response.ok){
                alert('Something went wrong adding the car please try again')
            }
            else{
                setMessage('Car successfully added!')
                setOpen(true);
                fetchCars()
            }
        })
        .catch(err=>console.error(err))
    }

    const updateCar = (updatedCar, link) =>{
        fetch(link, {
            method: 'PUT',
            headers:{ 'Content-Type': 'application/json'},
            body: JSON.stringify(updatedCar)
        })
        .then(response=> {
            if(!response.ok){
                alert('Something went wrong updating the car, please try again')
            }
            else{
                setMessage('Car successfully updated')
                setOpen(true)
                fetchCars()
            }
        })
        .catch(err=>console.error(err))
    }

    const [columns] = useState([
        {field: 'brand', sortable:true, filter:true},
        {field: 'model', sortable:true, filter:true},
        {field: 'color', sortable:true, filter:true},
        {field: 'fuel', sortable:true, filter:true},
        {field: 'year', sortable:true, filter:true, width:100},
        {field: 'price', sortable:true, filter:true, width:100},
        {
            headerName:'',
            width:100,
            field:'_links.self.href',
            cellRenderer: params => <Editcar params={params} updateCar={updateCar}/>
        },
        {
            headerName:'',
            width:100,
            field: '_links.self.href',
            cellRenderer: params => 
            <IconButton color='error' onClick={()=> deleteCar(params.value)}>
                <DeleteIcon/>
            </IconButton>
        }
    ])

    return(
        <>
            <Addcar addCar={addCar}/>
           <div className="ag-theme-material" style={{height: 600, width:'90%', marginLeft:90}}>
                <AgGridReact
                    columnDefs={columns}
                    rowData={cars}
                    pagination={true}
                    paginationPageSize={10}
                    suppressCellFocus={true}
                >
                </AgGridReact>
           </div>
           <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={()=>setOpen(false)}
           >
            <Alert onClose={()=>setOpen(false)} severity="success" sx={{ width: '100%' }}>
                {message}
            </Alert>
           </Snackbar>
        </>
    )
}

export default Carlist