import { gql, useApolloClient, useQuery } from "@apollo/client";
import {
  Cell,
  Row,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import React, { useState } from "react";
import BTable from "react-bootstrap/Table";

import { EntityResponse } from "../../APIClients/EntityAPIClient";
import { downloadCSV } from "../../utils/CSVUtils";
import { downloadFile } from "../../utils/FileUtils";

type EntityData = Omit<EntityResponse, "boolField"> & { boolField: string };

const convert = (entityResponse: EntityResponse): EntityData => ({
    id: entityResponse.id,
    stringField: entityResponse.stringField,
    intField: entityResponse.intField,
    stringArrayField: entityResponse.stringArrayField,
    enumField: entityResponse.enumField,
    boolField: entityResponse.boolField.toString(),
    fileName: entityResponse.fileName,
  });

type TableProps = {
  data: EntityData[];
  downloadEntityFile: (fileUUID: string) => void;
};

const createColumns = (downloadEntityFile: (fileUUID: string) => void) => {
  const columnHelper = createColumnHelper<EntityData>();
  return [
    columnHelper.accessor("id", { header: "id" }),
    columnHelper.accessor("stringField", { header: "stringField" }),
    columnHelper.accessor("intField", { header: "integerField" }),
    columnHelper.accessor("stringArrayField", { header: "stringArrayField" }),
    columnHelper.accessor("enumField", { header: "enumField" }),
    columnHelper.accessor("boolField", { header: "boolField" }),
    columnHelper.accessor("fileName", {
      header: "fileName",
      cell: (info) =>
        info.getValue() ? (
          <button
            type="button"
            onClick={() => downloadEntityFile(info.getValue())}
          >
            Download
          </button>
        ) : null,
    }),
  ];
};

const DisplayTable = ({ data, downloadEntityFile }: TableProps) => {
  const table = useReactTable<EntityData>({
    columns: createColumns(downloadEntityFile),
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

const ENTITIES = gql`
  query DisplayTableContainer_Entities {
    entities {
      id
      stringField
      intField
      enumField
      stringArrayField
      boolField
      fileName
    }
  }
`;

const ENTITIESCSV = gql`
  query DisplayTableContainer_EntitiesCSV {
    entitiesCSV
  }
`;

const FILE = gql`
  query DisplayTableContainer_File($fileUUID: ID!) {
    file(fileUUID: $fileUUID)
  }
`;

const DisplayTableContainer: React.FC = (): React.ReactElement | null => {
  const [entities, setEntities] = useState<EntityData[] | null>(null);

  const apolloClient = useApolloClient();

  useQuery(ENTITIES, {
    fetchPolicy: "cache-and-network",
    onCompleted: (data) => {
      setEntities(data.entities.map((d: EntityResponse) => convert(d)));
    },
  });

  const downloadEntityFile = async (fileUUID: string) => {
    const { data } = await apolloClient.query({
      query: FILE,
      variables: { fileUUID },
    });
    downloadFile(data.file, "file");
  };

  const downloadEntitiesCSV = async () => {
    if (entities) {
      const { data } = await apolloClient.query({
        query: ENTITIESCSV,
      });
      downloadCSV(data.entitiesCSV, "export.csv");
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
      {entities && (
        <DisplayTable data={entities} downloadEntityFile={downloadEntityFile} />
      )}
    </>
  );
};

export default DisplayTableContainer;
