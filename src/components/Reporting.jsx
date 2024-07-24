import { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const DPSReports = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const navigate = useNavigate();

    const handleApplyDateRange = () => {
        navigate(`/dashboard?startDate=${startDate}&endDate=${endDate}`);
    };

    return (
        <Container className="align-items-center">
            <h3 className="text-center">Apply Date Range Filter</h3>
            <Form className="d-flex flex-column align-items-center">
                <Form.Control
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="mb-2"
                />
                <Form.Control
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="mb-2"
                />
                <Button variant="primary" onClick={handleApplyDateRange}>
                    Apply Date Range
                </Button>
            </Form>
        </Container>
    );
};

export default DPSReports;
