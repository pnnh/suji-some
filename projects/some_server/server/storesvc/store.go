package storesvc

import (
	"context"

	"sujiserv/server/models"
)

func init() {
	//ctx := context.Background()
	//storeClient = createClient(ctx)
	//if storeClient == nil {
	//	log.Fatalln("初始化storeClient失败")
	//}
}

// 添加单个文档
func Add(ctx context.Context, collection string, doc map[string]interface{}) error {
	return AddDoc(ctx, collection, doc)
}

// 添加单个文档
func AddDoc(ctx context.Context, collection string, doc interface{}) error {
	//_, _, err := storeClient.Collection(collection).Add(ctx, doc)
	//if err != nil {
	//	return fmt.Errorf("failed adding alovelace: %v", err)
	//}
	return nil
}

// 查询文档集合
func Query(ctx context.Context, collection string, minCreatedInt64 int64) (*models.QueryResult, error) {
	//fmt.Println("开始读取文档")
	//iterQuery := storeClient.Collection(collection).
	//	OrderBy("Created", firestore.Desc).
	//	Limit(10)
	//// 传递该参数时过滤小于该时间的文档（最新文档排在上面）
	//if minCreatedInt64 > 0 {
	//	iterQuery = iterQuery.Where("Created", "<", minCreatedInt64)
	//	//iterQuery.StartAfter(minCreatedInt64)
	//}
	//docs := make([]map[string]interface{}, 0)
	//iter := iterQuery.Documents(ctx)
	//for {
	//	doc, err := iter.Next()
	//	if err == iterator.Done {
	//		fmt.Println("文档读取完成")
	//		break
	//	}
	//	if err != nil {
	//		return nil, fmt.Errorf("读取文档集出错 %v", err)
	//	}
	//	docs = append(docs, doc.Data())
	//}
	//
	//result := &models.QueryResult{Articles: docs}
	//return result, nil
	return nil, nil
}
