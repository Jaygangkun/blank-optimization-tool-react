import React from 'react';

import {
    Row,
    Col,
    Card,
    CardBody,
    CardTitle,
    Form,
    FormGroup,
    Input,
    Label,
} from 'reactstrap';

const BOTParameters = () => {
    return <div>
        {/*--------------------------------------------------------------------------------*/}
        {/* Start Inner Div*/}
        {/*--------------------------------------------------------------------------------*/}
        <Row>
            <Col sm="12" md="6" lg="4">
                <Card>
                    <CardTitle className="border-bottom p-3 mb-0"><i className="mdi mdi-priority-low mr-2"></i>Parameters</CardTitle>
                    <CardBody>
                        <Form>
                            <FormGroup>
                                <Label>IMPROVEMENT PERCENTAGE %</Label>
                                <Input type="text" defaultValue="1" />
                            </FormGroup>
                            <FormGroup>
                                <Label>NUMBER OF POINTS</Label>
                                <Input type="text" defaultValue="2500" />
                            </FormGroup>
                            <FormGroup>
                                <Label>INCREMENTAL STEPS</Label>
                                <Input type="text" defaultValue="100" />
                            </FormGroup>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {/*--------------------------------------------------------------------------------*/}
        {/*End Inner Div*/}
        {/*--------------------------------------------------------------------------------*/}
    </div>
}

export default BOTParameters;
