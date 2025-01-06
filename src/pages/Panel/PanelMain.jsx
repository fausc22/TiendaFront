import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menubar } from 'primereact/menubar';

const PanelMain = () => {
    const [customers, setCustomers] = useState([]);
    const items = [
        { label: 'Home', icon: 'pi pi-fw pi-home' },
        { label: 'About', icon: 'pi pi-fw pi-info' },
        { label: 'Contact', icon: 'pi pi-fw pi-phone' }
        // Agrega más ítems según sea necesario
    ];

    useEffect(() => {
        // Simula la carga de datos desde una API o fuente de datos
        const fetchedCustomers = [
            { name: 'John Doe', country: { name: 'USA' }, company: 'Company A', representative: { name: 'Jane Smith' } },
            { name: 'Anna Smith', country: { name: 'UK' }, company: 'Company B', representative: { name: 'John Brown' } },
            // Agrega más datos según sea necesario
        ];
        setCustomers(fetchedCustomers);
    }, []);

    return (
        <>
            <Menubar model={items} /> 
            <DataTable value={customers} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column field="name" header="Name" style={{ width: '25%' }}></Column>
                <Column field="country.name" header="Country" style={{ width: '25%' }}></Column>
                <Column field="company" header="Company" style={{ width: '25%' }}></Column>
                <Column field="representative.name" header="Representative" style={{ width: '25%' }}></Column>
            </DataTable>
        </>
    );
};

export default PanelMain;