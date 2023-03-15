import {
  deleteIndex,
  docBulk,
  initIndex,
  initMapping,
} from "../elasticServices";
import arrayChunk from "array-chunk";
import { sendStatus } from "../../middlewares/socket";

const AUTO_COMPLETE_CONFIG = {
  settings: {
    analysis: {
      analyzer: {
        autocomplete: {
          tokenizer: "autocomplete",
          filter: ["lowercase"],
        },
        autocomplete_search: {
          tokenizer: "lowercase",
        },
      },
      tokenizer: {
        autocomplete: {
          type: "edge_ngram",
          min_gram: 2,
          max_gram: 20,
          token_chars: ["letter"],
        },
      },
    },
  },
};

const ES_INDEX_CONFIG = {
  product_search: {
    MAPPING: {
      autocomplete: {
        type: "text",
        analyzer: "autocomplete",
        search_analyzer: "autocomplete_search",
      },
      sku_url: { type: "text" },
      product_name: { type: "text" },
    },
  },
  sku_search: {
    MAPPING: {
      properties: {
        sku_code: {
          type: "text",
        },
        sku_url: {
          type: "text",
        },
        sku_code_prefix: {
          type: "text",
        },
        sku_code_search: {
          type: "completion",
          analyzer: "simple",
          preserve_separators: true,
          preserve_position_increments: true,
          max_input_length: 50,
        },
      },
    },
  },
  seo_search: {
    MAPPING: {
      properties: {
        seo_url: {
          type: "text",
        },
        seo_search: {
          type: "completion",
        },
      },
    },
  },
};

const feedDataProcessor = ({ indexName, feedData }) => {
  return feedData
    .map((item) => {
      let result = [
        {
          index: {
            _index: indexName,
            _type: "_doc",
            _id: item?.id,
          },
        },
      ];
      switch (indexName) {
        case "product_search":
          result.push({
            product_name: item?.product_name ?? "",
            sku_url: item?.trans_sku_itemsts?.[0]?.sku_url ?? "",
            autocomplete: item?.product_name ?? "",
          });
          break;
        case "sku_search":
          result.push({
            sku_code: item?.generated_sku,
            sku_url: item?.sku_url,
            sku_code_prefix: item?.generated_sku,
            sku_code_search: item?.generated_sku
              ? item?.generated_sku.split(/[ ,]+/)
              : "",
          });
          break;
        case "seo_search":
          result.push({
            seo_url: item?.seo_url ?? "",
            seo_name: item?.seo_text ?? "",
            autocomplete: item?.seo_text ?? "",
          });
          break;
      }
      return result;
    })
    .flat();
};

export const fullIndexSync = ({
  indexName,
  feedData,
  initalizeRequired = false,
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (initalizeRequired) {
        await deleteIndex(indexName);
        console.log(`Index ${indexName} Deleted!`);
        let settings = AUTO_COMPLETE_CONFIG;
        if (indexName == "sku_search") {
          settings = false;
        }
        await initIndex(indexName, settings);
        console.log(`Index ${indexName} Created!`);
        await initMapping(
          indexName,
          "_doc",
          ES_INDEX_CONFIG[indexName].MAPPING
        );
        console.log(`Index ${indexName} mapping Created!`);
      }
      let processedData = feedDataProcessor({ indexName, feedData });
      const CHUNK_SIZE = 500;
      let chunkArray = arrayChunk(processedData, CHUNK_SIZE);
      for (let index = 0; index < chunkArray.length; index++) {
        const chunk = chunkArray[index];
        await docBulk(chunk);
        let completedCount = (index + 1) * CHUNK_SIZE;
        let finishedStatus = completedCount >= processedData.length;
        if (finishedStatus) completedCount = processedData.length;
        sendStatus(`${indexName}_sync`, {
          status: {
            completed: completedCount / processedData.length,
            completedCount: completedCount,
            totalCount: processedData.length,
            message:
              completedCount == processedData.length
                ? "Completed"
                : "InProgress",
          },
        });
      }
      resolve("Indexing Complete!");
    } catch (error) {
      reject(error);
    }
  });
};
