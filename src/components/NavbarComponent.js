import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Navbar from "react-bootstrap/Navbar";
import { Table } from "react-bootstrap";
import "./NavbarComponent.css";

export default function NavbarComponent(props) {
  const [stockSearchList, setStockSearchList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [url, setUrl] = useState("");

  let searchAPI = process.env.REACT_APP_STOCK_SEARCH_API.split("QUERY");

  const searchInputHandler = (e) => {
    setSearchQuery(e.target.value);
    setUrl(searchAPI[0] + searchQuery + searchAPI[1]);
    // console.log(url);
  };

  useEffect(() => {
    if (searchQuery !== "" && url !== "" && url.split("q=&").length !== 2) {
      // console.log(url);
      window
        .fetch(url)
        .then((response) => response.json())
        .then((data) => {
          if (data.quotes) {
            setStockSearchList(data.quotes.filter((stock) => stock.exchange));
            // console.log("stockSearchList: ", stockSearchList);
          }
        })
        .catch((err) => console.log(err));
    } else {
      setStockSearchList([]);
    }
  }, [searchQuery, url]);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">{props.heading}</Navbar.Brand>
        <Form className="d-flex mx-auto w-50">
          <Form.Control
            type="search"
            placeholder="Search"
            className="me-2"
            aria-label="Search"
            onChange={searchInputHandler}
            value={searchQuery}
          />
          {stockSearchList && stockSearchList.length > 0 ? (
            <div id="suggestionBox">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Name</th>
                    <th>Exchange</th>
                  </tr>
                </thead>
                <tbody>
                  {stockSearchList.map((stock, index) => {
                    return (
                      <tr
                        onClick={() => {
                          console.log(`/stock/${stock.symbol}`);
                        }}
                        key={index}
                      >
                        <td>{stock.symbol}</td>
                        <td>{stock.shortname} </td>
                        <td>Equity {stock.exchange}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <></>
          )}
        </Form>
      </Container>
    </Navbar>
  );
}
