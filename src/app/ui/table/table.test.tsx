import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Table } from "./table";

describe("Table", () => {
  it("should use semantic HTML elements", () => {
    render(
      <Table>
        <Table.Caption>Characters Directory</Table.Caption>
        <Table.Header>
          <Table.Row>
            <Table.Head>Column</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Data</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    expect(screen.getByRole("caption")).toHaveTextContent(
      "Characters Directory"
    );
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByRole("rowgroup")).toHaveLength(2);
    expect(screen.getAllByRole("row")).toHaveLength(2);
    expect(screen.getByRole("columnheader")).toHaveTextContent("Column");
    expect(screen.getByRole("cell")).toHaveTextContent("Data");
  });

  it("should support cusom attributes", () => {
    render(
      <Table aria-label="Character information">
        <Table.Header>
          <Table.Row>
            <Table.Head scope="col">Col 1</Table.Head>
            <Table.Head>Col 2</Table.Head>
            <Table.Head>Col 3</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row aria-selected="true">
            <Table.Cell colSpan={2}>Cell 1</Table.Cell>
            <Table.Cell>Cell 2</Table.Cell>
            <Table.Cell>Cell 3</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    );

    const table = screen.getByRole("table");
    expect(table).toHaveAttribute("aria-label", "Character information");

    const header = screen.getAllByRole("columnheader")[0];
    expect(header).toHaveAttribute("scope", "col");

    const row = screen.getAllByRole("row")[1];
    expect(row).toHaveAttribute("aria-selected", "true");

    const cell = screen.getAllByRole("cell")[0];
    expect(cell).toHaveAttribute("colSpan", "2");
  });
});
