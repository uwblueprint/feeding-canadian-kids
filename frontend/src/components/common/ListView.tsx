import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Center,
  Button as ChakraButton,
  Text,
} from "@chakra-ui/react";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/chakra-ui";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React from "react";

import LoadingSpinner from "./LoadingSpinner";

type ListViewProps = { 
    columns: {
        label: string;
        renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => JSX.Element;
    }[]; 
    rowOptions: {
        renderAfterRow: (item: TABLE_LIBRARY_TYPES.TableNode) => JSX.Element;
    }; 
    data: {
      nodes: TABLE_LIBRARY_TYPES.TableNode[] | undefined;
    } | undefined;
    loading: boolean; 
    requestType: string; 
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    rowsPerPage?: number 
};

const ListView = ({ columns, rowOptions, data, loading, requestType, currentPage, setCurrentPage, rowsPerPage = 10 }: ListViewProps) => {
  const chakraTheme = getTheme(DEFAULT_OPTIONS);
  const customTheme = {
    Table: `
        margin: 0 !important;
        width: 100%;
        --data-table-library_grid-template-columns: repeat(${columns.length - 1}, minmax(0, 1fr)) 88px;
  
        .animate {
          grid-column: 1 / -1;
  
          display: flex;
        }
  
        .animate > div {
          flex: 1;
          display: flex;
        }
      `,
    HeaderRow: `
        background-color: var(--chakra-colors-gray-50);
        color: var(--chakra-colors-gray-500);
        font-family: Inter;
        font-size: 14px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
        text-transform: none;
      `,
  };

  const theme = useTheme([chakraTheme, customTheme]);

  if (loading || !data) {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="100%"
        h="200px"
      >
        <LoadingSpinner />
      </Box>
    );
  }

  return (
    <Box mt="24px">
      <Box
        display="flex"
        alignItems="center"
        w="100%"
        h="64px"
        p="12px 16px"
        bgColor="gray.50"
        borderLeft="2px solid"
        borderColor="gray.gray83"
      >
        <Text variant="desktop-body-bold">{requestType}</Text>
      </Box>
      <CompactTable
        columns={columns}
        rowOptions={rowOptions}
        data={data}
        theme={theme}
        layout={{ custom: true }}
      />
      {data?.nodes?.length === 0 && (
        <Center h="100px">
          <Text>No {requestType} to display</Text>
        </Center>
      )}
      <Box
        display="flex"
        alignItems="center"
        w="100%"
        h="32px"
        p="12px 16px"
        bgColor="gray.50"
        border="1px solid #E2E8F0"
        borderRadius="0px 0px 8px 8px"
        gap="16px"
        color="#4A5568"
        justifyContent="right"
      >
        <Text fontSize="14px">Page: {currentPage}</Text>
        {currentPage === 1 ? (
          <ChevronLeftIcon w="24px" h="24px" color="#A0AEC0" />
        ) : (
          <ChevronLeftIcon
            w="24px"
            h="24px"
            cursor="pointer"
            onClick={() => setCurrentPage(currentPage - 1)}
          />
        )}
        {data?.nodes &&
        data.nodes.length !== 0 &&
        data.nodes.length % rowsPerPage === 0 ? (
          <ChevronRightIcon
            w="24px"
            h="24px"
            cursor="pointer"
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        ) : (
          <ChevronRightIcon w="24px" h="24px" color="#A0AEC0" />
        )}
      </Box>
    </Box>
  );
};

export default ListView;
