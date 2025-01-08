import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { ProForm, ProFormDateTimeRangePicker, ProFormDigit } from '@ant-design/pro-form/lib';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Col, message, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.BannerListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.BannerListItem>;
};

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [formLayoutType] = useState<LayoutType>(LAYOUT_TYPE_HORIZONTAL);

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
        message.success(`图片上传成功！链接：${imageUrl}`);
        console.log('图片链接:', imageUrl);
      } else {
        message.error('图片上传失败！');
      }
    }
  };

  return (
    <Modal
      width={640}
      // bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.product.searchTable.updateForm.productConfig',
        defaultMessage: '商品配置',
      })}
      open={props.updateModalOpen}
      onCancel={() => {
        props.onCancel();
      }}
      footer={null}
    >
      <ProForm
        initialValues={{
          id: props.values.id,
          name: props.values.name,
          type: props.values.type,
          contentType: props.values.contentType,
          contentUrl:
            props.values.contentUrl && props.values.contentUrl.length > 0
              ? [props.values.contentUrl].map((it: any, index: number) => ({
                  url: it,
                  uid: index + 1,
                  status: 'done',
                }))
              : [],
          clickUrl: props.values.clickUrl,
          dateRange: props.values.dateRange,
          status: props.values.status,
          priority: props.values.priority,
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
        <ProFormText name="id" hidden={true} />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.nameLabel',
            defaultMessage: 'banner name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.searchTable.bannerName"
                  defaultMessage="Banner name is required"
                />
              ),
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormSelect
          name="type"
          width="md"
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.typeLabel',
            defaultMessage: 'banner type',
          })}
          valueEnum={{
            BANNER: {
              text: '首页广告位',
            },
          }}
        />
        <ProFormDigit
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.priorityLabel',
            defaultMessage: 'banner priority',
          })}
          name="priority"
        />
        <ProFormSelect
          name="contentType"
          width="md"
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.contentTypeLabel',
            defaultMessage: 'banner contentType',
          })}
          valueEnum={{
            IMAGE: {
              text: '图片',
            },
            VIDEO: {
              text: '视频',
            },
          }}
        />
        <ProFormUploadButton
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.contentUrlLabel',
            defaultMessage: 'content url',
          })}
          max={1} // 限制只能上传一个文件
          action="/api/image" // SM.MS 图床上传地址
          name="contentUrl"
          onChange={handleUploadChange}
          listType="picture"
          accept="image/*" // 限制只能上传图片
        />
        <ProFormText
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.clickUrlLabel',
            defaultMessage: 'click url',
          })}
          width="md"
          name="clickUrl"
        />
        <ProFormDateTimeRangePicker
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.dateRangeLabel',
            defaultMessage: 'Date Range',
          })}
          name="dateRange"
          placeholder={[
            intl.formatMessage({
              id: 'pages.banner.searchTable.updateForm.startTimePlaceholder',
              defaultMessage: 'Start Time',
            }),
            intl.formatMessage({
              id: 'pages.banner.searchTable.updateForm.endTimePlaceholder',
              defaultMessage: 'End Time',
            }),
          ]}
        />
        <ProFormSelect
          name="status"
          options={[
            {
              //@ts-ignore
              value: true,
              label: '激活',
            },
            {
              //@ts-ignore
              value: false,
              label: '未激活',
            },
          ]}
          width="md"
          label={intl.formatMessage({
            id: 'pages.banner.searchTable.updateForm.statusLabel',
            defaultMessage: 'banner status',
          })}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
