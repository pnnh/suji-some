package storesvc

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
)

type Article struct {
	Id     string `json:"id"`
	Title  string
	Plot   string
	Rating float64
}

var dynamoSvc *dynamodb.Client

func init() {
	awsRegion := os.Getenv("AWS_REGION")
	if awsRegion == "" {
		awsRegion = "ap-east-1" // 默认香港区域
	}
	cfg, err := config.LoadDefaultConfig(context.Background(), config.WithRegion(awsRegion))
	if err != nil {
		log.Fatal("dynamodb初始化出错", err)
		return
	}
	dynamoSvc = dynamodb.NewFromConfig(cfg)
}

func valueToAttr(value interface{}) types.AttributeValue {
	switch r := value.(type) {
	case string:
		return &types.AttributeValueMemberS{Value: r}
	case int64:
		return &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", r)}
	case uint64:
		return &types.AttributeValueMemberN{Value: fmt.Sprintf("%d", r)}
	case float64:
		return &types.AttributeValueMemberN{Value: fmt.Sprintf("%f", r)}
	case []interface{}:
		return &types.AttributeValueMemberL{Value: valueLToAttrL(r)}
	case map[string]interface{}:
		return &types.AttributeValueMemberM{Value: mapToAttr(r)}
	}
	return &types.AttributeValueMemberS{Value: fmt.Sprintf("%v", value)}
}

func attrToValue(value types.AttributeValue) interface{} {
	switch r := value.(type) {
	case *types.AttributeValueMemberS:
		return r.Value
	case *types.AttributeValueMemberN:
		return r.Value
	case *types.AttributeValueMemberL:
		return attrLToValueL(r.Value)
	case *types.AttributeValueMemberM:
		return attrToMap(r.Value)
	}
	return &types.AttributeValueMemberS{Value: fmt.Sprintf("%v", value)}
}

func valueLToAttrL(values []interface{}) []types.AttributeValue {
	attributes := make([]types.AttributeValue, len(values))
	for k, v := range values {
		attributes[k] = valueToAttr(v)
	}
	return attributes
}

func attrLToValueL(values []types.AttributeValue) []interface{} {
	attributes := make([]interface{}, len(values))
	for k, v := range values {
		attributes[k] = attrToValue(v)
	}
	return attributes
}

func mapToAttr(artMap map[string]interface{}) map[string]types.AttributeValue {
	itemMap := make(map[string]types.AttributeValue)
	for k, v := range artMap {
		itemMap[k] = valueToAttr(v)
	}
	return itemMap
}

func attrToMap(attributes map[string]types.AttributeValue) map[string]interface{} {
	itemMap := make(map[string]interface{})
	for k, v := range attributes {
		itemMap[k] = attrToValue(v)
	}
	return itemMap
}

func PutArticle(ctx context.Context, artMap map[string]interface{}) error {
	log.Println("开始写入", time.Now())

	table := "posts"

	itemMap2, err := attributevalue.MarshalMap(artMap)
	if err != nil {
		return fmt.Errorf("marshalMap出错: %w", err)
	}
	log.Println("marshal", itemMap2)

	_, err = dynamoSvc.PutItem(ctx, &dynamodb.PutItemInput{
		Item:      itemMap2,
		TableName: &table,
	})

	if err != nil {
		fmt.Println("出错了", err)
		return err
	}
	log.Println("全部写入完成", time.Now())
	return err
}

func GetArticle(ctx context.Context, uk, pk uint64) (map[string]interface{}, error) {
	table := "posts"
	keyMap := map[string]uint64{
		"uk": uk, "pk": pk,
	}
	key, err := attributevalue.MarshalMap(keyMap)
	if err != nil {
		return nil, fmt.Errorf("marshalMap出错: %w", err)
	}
	out, err := dynamoSvc.GetItem(ctx, &dynamodb.GetItemInput{
		Key:       key,
		TableName: &table,
	})
	if err != nil {
		return nil, fmt.Errorf("GetItem出错: %w", err)
	}
	result := make(map[string]interface{})
	if err = attributevalue.UnmarshalMap(out.Item, &result); err != nil {
		return nil, fmt.Errorf("unmarshalMap出错: %w", err)
	}
	return result, err
}

func QueryArticles(ctx context.Context) ([]map[string]interface{}, error) {

	table := "articles"
	//index := "at-index"
	limit := int32(8)
	at := 0
	//filt1 := expression.Name("at").GreaterThan(expression.Value(&at))
	//expr, err := expression.NewBuilder().WithFilter(filt1).Build()
	//if err != nil {
	//	log.Println("Got error building expression:", err)
	//	return nil, err
	//}
	// Get items in that year.
	filt1 := expression.Name("at").GreaterThan(expression.Value(&at))

	// Get back the title and rating (we know the year).
	//proj := expression.NamesList(expression.Name("title"), expression.Name("info.rating"))

	expr, err := expression.NewBuilder().WithFilter(filt1).
		//WithProjection(proj).
		Build()
	if err != nil {
		log.Println("Got error building expression:", err)
		return nil, err
	}

	input := &dynamodb.ScanInput{
		ExpressionAttributeNames:  expr.Names(),
		ExpressionAttributeValues: expr.Values(),
		FilterExpression:          expr.Filter(),
		TableName:                 &table,
		Limit:                     &limit,
	}
	out, err := dynamoSvc.Scan(ctx, input)
	if err != nil {
		fmt.Println("QueryArticles 出错了", err)
		return nil, err
	}
	log.Printf("QueryArticles == %v %d", out.ConsumedCapacity, out.ScannedCount)
	result := make([]map[string]interface{}, out.Count)
	for k, v := range out.Items {
		result[k] = attrToMap(v)
	}
	return result, err
}
