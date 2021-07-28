package resources

import (
	"errors"
	"fmt"
	"strings"
)

func buildBody(nodes map[string]interface{}) (string, error) {
	children, ok := nodes["children"].([]interface{})
	if !ok {
		return "", errors.New("缺少字段children")
	}

	builder := strings.Builder{}
	for k, v := range children {
		child, ok := v.(map[string]interface{})
		if !ok {
			return "", fmt.Errorf("类型错误: %d", k)
		}
		content, err := buildNode(child)
		if err != nil {
			return "", fmt.Errorf("buildNode出错: %w", err)
		}
		builder.WriteString(content)
	}
	return builder.String(), nil
}

func buildNode(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	name := value["name"]
	switch name {
	case "paragraph":
		return buildParagraph(node)
	case "header":
		return buildHeader(node)
	case "code-block":
		return buildCodeBlock(node)
	}
	return "", nil
}

func buildParagraph(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	children, ok := value["children"].([]interface{})
	if !ok {
		return "", errors.New("缺少字段children")
	}

	builder := strings.Builder{}
	builder.WriteString("<p>")
	for k, v := range children {
		text, err := buildText(v)
		if err != nil {
			return "", fmt.Errorf("buildText错误: %d", k)
		}
		builder.WriteString(text)
	}
	builder.WriteString("</p>")
	return builder.String(), nil
}

func buildCodeBlock(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	children, ok := value["children"].([]interface{})
	if !ok {
		return "", errors.New("缺少字段children")
	}
	language, ok := value["language"].(string)
	if !ok {
		return "", errors.New("缺少字段language")
	}
	builder := strings.Builder{}
	builder.WriteString(fmt.Sprintf("<pre class='code' data-lang='%s'>", language))

	for k, v := range children {
		text, err := buildCode(v)
		if err != nil {
			return "", fmt.Errorf("buildText错误: %d", k)
		}
		builder.WriteString(text)
	}

	builder.WriteString("</pre>")

	return  builder.String(), nil
}

func buildHeader(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	header, ok := value["header"].(float64)
	if !ok {
		return "", fmt.Errorf("缺少字段header")
	}
	children, ok := value["children"].([]interface{})
	if !ok {
		return "", errors.New("缺少字段children")
	}
	builder := strings.Builder{}
	builder.WriteString(fmt.Sprintf("<h%.0f>", header))

	for k, v := range children {
		text, err := buildText(v)
		if err != nil {
			return "", fmt.Errorf("buildText错误: %d", k)
		}
		builder.WriteString(text)
	}

	builder.WriteString(fmt.Sprintf("</h%.0f>", header))

	return  builder.String(), nil
}

func buildText(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	text, ok := value["text"].(string)
	if !ok {
		return "", fmt.Errorf("文本节点类型有误")
	}
	//return fmt.Sprintf("<span>%s</span>", text), nil
	return text, nil
}

func buildCode(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	text, ok := value["text"].(string)
	if !ok {
		return "", fmt.Errorf("文本节点类型有误")
	}
	//return fmt.Sprintf("<span>%s</span>", text), nil
	return text, nil
}

