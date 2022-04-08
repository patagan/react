import React, { Component } from 'react';
import { Card, CardImg, CardText, CardBody, Button,
  CardTitle, Breadcrumb, BreadcrumbItem,  Row, Col, Label } from 'reactstrap';
  
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';

  function RenderDish({dish}) {
    
    return(
      <div className="col-12 col-md-5 m-1">
        <FadeTransform
              in
              transformProps={{
                  exitTransform: 'scale(0.5) translateY(-50%)'
              }}>
          <Card>
              <CardImg top src={baseUrl + dish.image} alt={dish.name} />
              <CardBody>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardText>{dish.description}</CardText>
              </CardBody>
          </Card>
        </FadeTransform>
      </div>
    );

  }

  function RenderComments({comments}) {
      
    return comments.map((comment) => {
      return (
        
        <Fade in>
        <li key={comment.id}>
        <p>{comment.comment}</p>
        <p>-- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
        </li>
        </Fade>
      )
    });
    
  }

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
        console.log("Current state is: "+JSON.stringify(values));
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }

    render() {
        return(
            <div className="container">
                <div className="row">
                    <Button outline color="secondary" onClick={this.toggleModal}><span className="fa fa-edit"></span> Submit Comment</Button>
                </div>
                <div className="row">
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group">
                                <Label htmlFor="rating" md={2}>Rating</Label>
                                    <Col md={10}>
                                        <Control.select model=".rating" id="rating" name="rating"
                                            className="form-control"
                                        >
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="author" md={2}>Your Name </Label>
                                    <Col md={10}>
                                        <Control.text model=".author" name="author" id="author"
                                            placeholder="Your Name"
                                            className="form-control"
                                            validators={{required, minLength: minLength(3), maxLength: maxLength(15)}}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            messages={{
                                                required: 'Required',
                                                minLength: 'Cannot be less than 3 characters.',
                                                maxLength: 'Cannot be greater than 15 characters.'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="comment" md={2}>Comment</Label>
                                    <Col md={10}>
                                        <Control.textarea model=".comment" id="comment" name="comment"
                                            rows="6"
                                            className="form-control"
                                            validators={{required}}
                                        />
                                        <Errors 
                                            className="text-danger"
                                            model=".comment"
                                            show="touched"
                                            messages={{
                                                required: 'Required'
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col md={{size: 10, offset: 2}}>
                                        <Button type="submit" value="submit" color="primary">Submit</Button>
                                    </Col>
                                </Row>
                            </LocalForm>
                </div>
            </div>
        );
    }
}

const DishDetail = (props) => {    
      if (props.isLoading) {
        return(
            <div className="container">
                <div className="row">            
                    <Loading />
                </div>
            </div>
        );
      }
      else if (props.errMess) {
          return(
              <div className="container">
                  <div className="row">            
                      <h4>{props.errMess}</h4>
                  </div>
              </div>
          );
      }
      else if (props.dish != null)  {
        return (
          <div className="container">
          <div className="row">
              <Breadcrumb>
  
                  <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                  <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
              </Breadcrumb>
              <div className="col-12">
                  <h3>{props.dish.name}</h3>
                  <hr />
              </div>                
          </div>
          <div className="row">
            <RenderDish dish={props.dish} />
            <div className="col-12 col-md-5 m-1">
            <h1>Comments</h1>
            <Stagger in>
              <RenderComments comments={props.comments}/>
            </Stagger>
            <CommentForm dishId={props.dish.id} postComment={props.postComment} />
            </div>
          </div>

          </div>
      );
      } else {
         return(
          <div></div>
         );
      }
    }

export default DishDetail;