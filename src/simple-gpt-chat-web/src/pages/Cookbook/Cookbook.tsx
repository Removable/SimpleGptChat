import { useOidc } from '@axa-fr/react-oidc';
import { useRequest, useTitle } from 'ahooks';
import { Button, Modal, Select, SelectProps, Space, Tabs, TabsProps } from 'antd';
import React, { useEffect, useState } from 'react';

import TagSelect from '../../components/TagSelect';
import { myAxios } from '../../my-axios';

const Cookbook = () => {
  useTitle('AI菜谱推荐');
  const auth = useOidc();
  const tabItems: TabsProps['items'] = [
    {
      key: '1',
      label: '根据食材推荐',
      children: <OnDemandTab />,
    },
    {
      key: '2',
      label: '随机推荐',
      children: <RandomTab />,
    },
  ];

  useEffect(() => {
    if (auth.isAuthenticated) {
      // 设置返回按钮
    }
    return () => {
      if (auth.isAuthenticated) {
        // 清除返回按钮
      }
    };
  });

  return (
    <div className="w-screen h-screen bg-white md:p-5 p-1">
      <Tabs defaultActiveKey="1" items={tabItems} />
    </div>
  );
};

const OnDemandTab = () => {
  const [options, setOptions] = useState<SelectProps['options']>([]);
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (value: { value: string; label: React.ReactNode }) => {
    // setSelected([...value.label]);
    console.log(value.label);
  };

  const getIngredients = (keyword: string) => {
    return myAxios.get<IngredientInfo[]>(
      '/api/Cookbook/GetIngredients?keyword=' + keyword,
    );
  };
  const getIngredientsRequest = useRequest(getIngredients, {
    manual: true,
    debounceWait: 500,
  });

  const handleSearch = async (newValue: string) => {
    if (newValue) {
      const res = await getIngredientsRequest.runAsync(newValue);
      if (!res.data) return;

      const newOptions = res.data.map((item) => ({
        label: item.name,
        value: item.pinyin,
      }));
      console.log(newOptions);
      setOptions(newOptions);
    } else {
      setOptions([]);
    }
  };

  const handleClear = () => {
    Modal.confirm({
      title: '确定清空吗？',
      onOk: () => {
        setSelected([]);
      },
    });
  };

  return (
    <div>
      <div className="w-full flex flex-col">
        <Select
          size="large"
          optionFilterProp="label"
          mode="tags"
          style={{ width: '100%' }}
          placeholder="选择食材 - 可以搜索选择也可以自定义输入"
          onChange={handleChange}
          onSearch={handleSearch}
          // value={selected}
          options={options || []}
        />
        <TagSelect
          className="mt-4"
          placeholder="选择食材 - 可以搜索选择也可以自定义输入"
        />
      </div>
      <div className="w-full flex justify-end p-3">
        <Space>
          <Button type="default" danger onClick={handleClear}>
            清空
          </Button>
          <Button type="primary">问问AI</Button>
        </Space>
      </div>
      <div></div>
    </div>
  );
};

const RandomTab = () => {
  return <div>random</div>;
};

export default Cookbook;

interface IngredientInfo {
  name: string;
  pinyin: string;
}
