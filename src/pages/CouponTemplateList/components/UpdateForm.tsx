import { product } from '@/services/ant-design-pro/api';
import { ProFormSelect, ProFormText } from '@ant-design/pro-components';
import {
  ProForm,
  ProFormDateTimeRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormSwitch,
} from '@ant-design/pro-form/lib';
import { FormattedMessage, useIntl } from '@umijs/max';
import { Col, Modal, Row, Space } from 'antd';
import React, { useState } from 'react';

export type FormValueType = {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
} & Partial<API.CouponTemplateListItem>;

export type UpdateFormProps = {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalOpen: boolean;
  values: Partial<API.CouponTemplateListItem>;
};

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';
const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const intl = useIntl();
  const [formLayoutType] = useState<LayoutType>(LAYOUT_TYPE_HORIZONTAL);

  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 8 },
          wrapperCol: { span: 10 },
        }
      : null;

  return (
    <Modal
      width={640}
      // bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title={intl.formatMessage({
        id: 'pages.couponTemplateList.updateForm.title',
        defaultMessage: 'coupon template update',
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
          discountRate: props.values.discountRate,
          fullAmount: props.values.fullAmount,
          reduceAmount: props.values.reduceAmount,
          cashAmount: props.values.cashAmount,
          redeemProductId: props.values.redeemProductId,
          validityType: props.values.validityType,
          validityDays: props.values.validityDays,
          minOrderAmount: props.values.minOrderAmount,
          applicableProductTypes: props.values.applicableProductTypes,
          dateRange: props.values.dateRange,
          status: props.values.status,
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
            id: 'pages.couponTemplate.searchTable.updateForm.nameLabel',
            defaultMessage: 'coupon template name',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.couponTemplate.searchTable.updateForm.nameRule"
                  defaultMessage="coupon template name is required"
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
            id: 'pages.couponTemplate.searchTable.updateForm.typeLabel',
            defaultMessage: 'coupon template type',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.couponTemplate.searchTable.updateForm.typeRule"
                  defaultMessage="Please select coupon template type"
                />
              ),
            },
          ]}
          valueEnum={{
            DISCOUNT: {
              text: '折扣券',
            },
            FULL_REDUCE: {
              text: '满减券',
            },
            CASH: {
              text: '现金券',
            },
            REDEEM: {
              text: '兑换券',
            },
          }}
        />
        {/* 监听 type 字段，动态渲染配置项 */}
        <ProFormDependency name={['type']}>
          {({ type }) => {
            switch (type) {
              case 'DISCOUNT':
                return (
                  <ProFormDigit
                    name="discountRate"
                    label="折扣比例"
                    width="md"
                    min={1}
                    max={99}
                    fieldProps={{ addonAfter: '%' }}
                    rules={[{ required: true, message: '请输入折扣比例' }]}
                  />
                );
              case 'FULL_REDUCE':
                return (
                  <>
                    <ProFormDigit
                      name="fullAmount"
                      label="满减门槛"
                      width="md"
                      min={0}
                      fieldProps={{ prefix: '¥' }}
                      rules={[{ required: true, message: '请输入满减门槛金额' }]}
                    />
                    <ProFormDigit
                      name="reduceAmount"
                      label="优惠金额"
                      width="md"
                      min={1}
                      fieldProps={{ prefix: '¥' }}
                      rules={[{ required: true, message: '请输入优惠金额' }]}
                    />
                  </>
                );
              case 'CASH':
                return (
                  <ProFormDigit
                    name="cashAmount"
                    label="现金金额"
                    width="md"
                    min={1}
                    fieldProps={{ prefix: '¥' }}
                    rules={[{ required: true, message: '请输入现金金额' }]}
                  />
                );
              case 'REDEEM':
                return (
                  <ProFormSelect
                    name="redeemProductId"
                    label="兑换商品"
                    width="md"
                    rules={[{ required: true, message: '请选择兑换商品' }]}
                    showSearch
                    debounceTime={300}
                    request={async ({ keyWords }) => {
                      const data = await product({
                        name: keyWords,
                        pageSize: 10,
                        current: 1,
                      });
                      if (data.data) {
                        return data.data.map((item) => {
                          return {
                            label: item.name,
                            value: item.id,
                          };
                        });
                      }
                      return [];
                    }}
                  />
                );
              default:
                return null;
            }
          }}
        </ProFormDependency>
        <ProFormSelect
          name="validityType"
          width="md"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.validityTypeLabel',
            defaultMessage: 'Validity period type',
          })}
          rules={[
            {
              required: true,
              message: (
                <FormattedMessage
                  id="pages.couponTemplate.searchTable.updateForm.validityTypeRule"
                  defaultMessage="Please select validity period type"
                />
              ),
            },
          ]}
          valueEnum={{
            ABSOLUTE: {
              text: '绝对时间',
            },
            RELATIVE: {
              text: '相对时间',
            },
          }}
        />
        {/* 监听 validityType 字段，动态渲染配置项 */}
        <ProFormDependency name={['validityType']}>
          {({ validityType }) => {
            switch (validityType) {
              case 'ABSOLUTE':
                return (
                  <ProFormDateTimeRangePicker
                    label={intl.formatMessage({
                      id: 'pages.couponTemplate.searchTable.updateForm.dateRangeLabel',
                      defaultMessage: 'Date Range',
                    })}
                    name="dateRange"
                    placeholder={[
                      intl.formatMessage({
                        id: 'pages.couponTemplate.searchTable.updateForm.startTimePlaceholder',
                        defaultMessage: 'Start Time',
                      }),
                      intl.formatMessage({
                        id: 'pages.couponTemplate.searchTable.updateForm.endTimePlaceholder',
                        defaultMessage: 'End Time',
                      }),
                    ]}
                    rules={[{ required: true, message: '请选择有效期时间' }]}
                  />
                );
              case 'RELATIVE':
                return (
                  <>
                    <ProFormDigit
                      name="validityDays"
                      label="有效天数"
                      width="md"
                      min={1}
                      rules={[{ required: true, message: '请输入有效天数' }]}
                    />
                  </>
                );
              default:
                return null;
            }
          }}
        </ProFormDependency>
        <ProFormDigit
          name="minOrderAmount"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.minOrderAmountLabel',
            defaultMessage: 'Minimum order amount',
          })}
          width="md"
          fieldProps={{ prefix: '¥' }}
        />
        <ProFormSwitch
          name="status"
          width="md"
          label={intl.formatMessage({
            id: 'pages.couponTemplate.searchTable.updateForm.statusLabel',
            defaultMessage: 'couponTemplate status',
          })}
        />
      </ProForm>
    </Modal>
  );
};

export default UpdateForm;
