import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, InputNumber, Layout, List, Typography } from 'antd';
import React, { useState } from 'react';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function Cookbook() {
  const [recipeCount, setRecipeCount] = useState(0);
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<string[]>([]);

  const fetchRecipes = async () => {
    // 在此处调用API或其他方法获取菜谱数据，将数据赋值给recipes
  };

  const handleRandomSubmit = async () => {
    await fetchRecipes();
  };

  const handleIngredientSubmit = async () => {
    await fetchRecipes();
  };

  return (
    <Layout className="App">
      <Header>
        <Title level={2} style={{ color: 'white' }}>
          家常菜推荐
        </Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div className="random-recipe">
          <Title level={4}>随机推荐家常菜</Title>
          <InputNumber
            value={recipeCount}
            onChange={(value) => setRecipeCount(value ?? 0)}
            placeholder="推荐菜谱数量"
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleRandomSubmit}>
            获取推荐
          </Button>
        </div>
        <div className="ingredient-recipe">
          <Title level={4}>根据食材设计家常菜</Title>
          <Input
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="请输入食材清单，用逗号隔开"
          />
          <InputNumber
            value={recipeCount}
            onChange={(value) => setRecipeCount(value ?? 0)}
            placeholder="设计菜谱数量"
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={handleIngredientSubmit}
          >
            获取菜谱
          </Button>
        </div>
        <div className="recipe-list">
          <Title level={4}>推荐菜谱</Title>
          {recipes.length === 0 ? (
            <p>暂无推荐菜谱，请使用上面的功能获取推荐。</p>
          ) : (
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={recipes}
              renderItem={(recipe) => <List.Item></List.Item>}
            />
          )}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        ©2023 家常菜推荐. All rights reserved. 联系我们：contact@example.com
      </Footer>
    </Layout>
  );
}

export default Cookbook;
