import {
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Col, message, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';
import { ProForm, ProFormMoney } from '@ant-design/pro-form/lib';
import { ProFormUploadButton } from '@ant-design/pro-form';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.ProductListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.ProductListItem>;
};

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [formLayoutType] = useState<LayoutType>(
    LAYOUT_TYPE_HORIZONTAL,
  );

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      }
      : null;


  const handleUploadChange = (info: { file: any }) => {
    const { file } = info;

    if (file.status === 'uploading') {
      console.log('Uploading...');
      return;
    }

    if (file.status === 'done') {
      // 假设图床返回的链接在 response.url 中
      const imageUrl = file.response?.url;
      if (imageUrl) {
        message.success(`图片上传成功！链接：${imageUrl}`)
        console.log('图片链接:', imageUrl);
      } else {
        message.error('图片上传失败！')
      }
    }
  };


  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.product.searchTable.updateForm.productConfig',
        defaultMessage: '商品配置',
      })}
      open={props.updateModalOpen}
      onCancel={() => {
        props.onCancel();
      }}
    >
      <ProForm
        initialValues={{
          id: props.values.id,
          name: props.values.name,
          imageUrl: [props.values.imageUrl],
          category: props.values.category,
          price: props.values.price,
          isAvailable: props.values.isAvailable
        }}
        {...formItemLayout}
        layout={formLayoutType}
        submitter={{
          render: (props, doms) => {
            return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
              <Row>
                <Col span={14} offset={4}>
                  <Space>{doms}</Space>
                </Col>
              </Row>
            ) : (
              doms
            );
          },
        }}
        onFinish={props.onSubmit}
      >
        <ProFormText
          name="id"
          hidden={true}
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.nameLabel',
            defaultMessage: 'productName',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.productName"
                  defaultMessage="Product name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormSelect
          name="category"
          width="md"
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.categoryLabel',
            defaultMessage: 'product category',
          })}
          valueEnum={{
            '午餐': {
              text: '午餐',
            },
            '晚餐': {
              text: '晚餐',
            },
          }}
        />
        <ProFormUploadButton
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.imageUrlLabel',
            defaultMessage: 'product image url',
          })}
          max={1} // 限制只能上传一个文件
          action="/api/image" // SM.MS 图床上传地址
          name="imageUrl"
          onChange={handleUploadChange}
          listType="picture"
          accept="image/*" // 限制只能上传图片
        />
        <ProFormMoney
          label={intl.formatMessage({
            id: 'pages.product.searchTable.updateForm.priceLabel',
            defaultMessage: 'product price',
          })}
          width="md"
          name="price"
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
