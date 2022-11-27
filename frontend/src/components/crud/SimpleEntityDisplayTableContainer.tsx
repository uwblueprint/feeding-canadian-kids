import React, { useState } from "react";
import BTable from "react-bootstrap/Table";
import {
  Cell,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { gql, useApolloClient, useQuery } from "@apollo/client";

import { SimpleEntityResponse } from "../../APIClients/SimpleEntityAPIClient";
import { downloadCSV } from "../../utils/CSVUtils";

type EntityData = Omit<SimpleEntityResponse, "boolField"> & {
  boolField: string;
};

const convert = (entityResponse: SimpleEntityResponse): EntityData => {
  return {
    id: entityResponse.id,
    stringField: entityResponse.stringField,
    intField: entityResponse.intField,
    stringArrayField: entityResponse.stringArrayField,
    enumField: entityResponse.enumField,
    boolField: entityResponse.boolField.toString(),
  };
};

type TableProps = {
  data: EntityData[];
};

const columnHelper = createColumnHelper<EntityData>();
const columns = [
  columnHelper.accessor("id", { header: "id" }),
  columnHelper.accessor("stringField", { header: "stringField" }),
  columnHelper.accessor("intField", { header: "integerField" }),
  columnHelper.accessor("stringArrayField", { header: "stringArrayField" }),
  columnHelper.accessor("enumField", { header: "enumField" }),
  columnHelper.accessor("boolField", { header: "boolField" }),
];

const SimpleEntityDisplayTable = ({ data }: TableProps) => {
  const table = useReactTable<EntityData>({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <BTable striped bordered hover size="sm" style={{ marginTop: "20px" }}>
      <thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row: Row<EntityData>) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell: Cell<EntityData, unknown>) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </BTable>
  );
};

const SIMPLE_ENTITIES = gql`
  query SimpleEntityDisplayTableContainer_SimpleEntities {
    simpleEntities {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
    }
  }
`;

const SIMPLE_ENTITIESCSV = gql`
  query SimpleEntityDisplayTableContainer_SimpleEntitiesCSV {
    simpleEntitiesCSV
  }
`;

const SimpleEntityDisplayTableContainer: React.FC = (): React.ReactElement | null => {
  const [entities, setEntities] = useState<EntityData[] | null>(null);

  const apolloClient = useApolloClient();

  useQuery(SIMPLE_ENTITIES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setEntities(
        data.simpleEntities.map((d: SimpleEntityResponse) => convert(d)),
      );
    },
  });

  const downloadEntitiesCSV = async () => {
    if (entities) {
      const { data } = await apolloClient.query({
        query: SIMPLE_ENTITIESCSV,
      });
      downloadCSV(data.simpleEntitiesCSV, "export.csv");
      // Use the following lines to download CSV using frontend CSV generation instead of API
      // const csvString = await generateCSV<EntityData>({ data: entities });
      // downloadCSV(csvString, "export.csv");
    }
  };

  return (
    <>
      <button type="button" onClick={downloadEntitiesCSV}>
        Download CSV
      </button>
      {entities && <SimpleEntityDisplayTable data={entities} />}
    </>
  );
};

export default SimpleEntityDisplayTableContainer;
