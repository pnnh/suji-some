package resources

import (
	"errors"
	"fmt"
	"html"
	"strings"
)

type TocItem struct {
	Title  string
	Header int
}

func buildBody(tocArray *[]TocItem, nodes map[string]interface{}) (string, error) {
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
		content, err := buildNode(tocArray, child)
		if err != nil {
			return "", fmt.Errorf("buildNode出错: %w", err)
		}
		builder.WriteString(content)
	}
	return builder.String(), nil
}

func buildNode(tocArray *[]TocItem, node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	name := value["name"]
	switch name {
	case "paragraph":
		return buildParagraph(node)
	case "header":
		return buildHeader(tocArray, node)
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
	builder.WriteString("<p class='fx-paragraph'>")
	for k, v := range children {
		text, err := buildText(v)
		if err != nil {
			return "", fmt.Errorf("buildText错误: %d", k)
		}
		//text = html.EscapeString(text)
		text = strings.ReplaceAll(text, "\n", "<br/>")
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
	builder.WriteString(fmt.Sprintf("<pre class='fx-code-block code' data-lang='%s'><code>", language))

	for k, v := range children {
		text, err := buildCode(v)
		if err != nil {
			return "", fmt.Errorf("buildText错误: %d", k)
		}
		builder.WriteString(html.EscapeString(text))
	}

	builder.WriteString("</code></pre>")

	return builder.String(), nil
}

func buildHeader(tocArray *[]TocItem, node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	headerFloat, ok := value["header"].(float64)
	if !ok {
		return "", fmt.Errorf("缺少字段header")
	}
	header := int(headerFloat)
	children, ok := value["children"].([]interface{})
	if !ok {
		return "", errors.New("缺少字段children")
	}
	builder := strings.Builder{}
	headerText := ""

	for k, v := range children {
		text, err := buildHeaderText(v)
		if err != nil {
			return "", fmt.Errorf("buildText错误: %d", k)
		}
		headerText = text
		*tocArray = append(*tocArray, TocItem{Title: headerText, Header: header})
		break
	}
	builder.WriteString(fmt.Sprintf("<h%d id='%s'>", header, headerText))
	builder.WriteString(headerText)
	builder.WriteString(fmt.Sprintf("</h%d>", header))

	return builder.String(), nil
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
	text = html.EscapeString(text)
	textDecoration := ""
	className := ""
	if _, ok := value["strike"]; ok {
		textDecoration += " line-through"
	}
	if _, ok := value["bold"]; ok {
		className += " fx-bold"
	}
	if _, ok := value["italic"]; ok {
		className += " fx-italic"
	}
	if _, ok := value["underline"]; ok {
		textDecoration += " underline"
	}
	if _, ok := value["code"]; ok {
		className += " fx-code"
	}
	property := ""
	if len(className) > 0 {
		property += fmt.Sprintf(" class='%s'", className)
	}
	if len(textDecoration) > 0 {
		property += fmt.Sprintf(" style='text-decoration:%s'", textDecoration)
	}
	return fmt.Sprintf("<span %s>%s</span>", property, text), nil
	//return text, nil
}

func buildHeaderText(node interface{}) (string, error) {
	value, ok := node.(map[string]interface{})
	if !ok {
		return "", fmt.Errorf("类型错误")
	}
	text, ok := value["text"].(string)
	if !ok {
		return "", fmt.Errorf("文本节点类型有误")
	}
	text = html.EscapeString(text)
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
