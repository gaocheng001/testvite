        <template>
  <div class="account-picker" style="width:500px">
    <AccountPickerThemeOne v-if="props.theme=='two'" v-bind="$attrs" :theme="props.theme">
      <template v-slot:default="{fun,info}">
        <div style="margin-left:30px">
          <div style="margin-left: 1%;font-size: 14px;">
            <span style="color: #666666;font-weight: bold">账套代码：</span>
            <span v-if="props.readonly==''"
                  style="background-color: white;padding: 6px 10px;border-radius: 5px;font-weight: bold;color: black;">{{ info.coCode }}</span>
            <span v-else :ref="fun.one"></span>
            <div style="margin-top:10px;font-size: 14px;">
              <span style="color: #666666;font-weight: bold">账套名称：</span> <span :ref="fun.two"/>
              <span style="color: #666666;font-weight: bold">&emsp;&emsp;年度：</span>
              <span style="color: black;font-weight: bold" v-if="props.readonly==''">{{ info.iyear }}</span>
              <span v-else :ref="fun.three"></span>
            </div>
          </div>
        </div>
      </template>
    </AccountPickerThemeOne>
    <AccountPickerThemeOne v-else-if="props.theme=='one'" v-bind="$attrs"  :theme="props.theme">
      <template v-slot:default="{fun,info}">
        <div style="margin-left:0px">
          <div style="margin-left: 1%;font-size: 14px;">
            <span style="color: #666666;font-weight: bold"> 账套代码：</span>
            <span v-if="props.readonly==''" style="padding: 6px 10px;border-radius: 5px;background-color: #f2f2f2;font-weight: bold;">{{ info.coCode }}</span>
            <span v-else :ref="fun.one"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #666666;font-weight: bold">账套名称：</span> <span style="font-weight: bold;" :ref="fun.two"/>
            <span style="color: #666666;font-weight: bold">&emsp;年度：</span>
            <span v-if="props.readonly==''" style="padding: 6px 10px;border-radius: 5px;background-color: #f2f2f2;font-weight: bold;">{{ info.iyear }}</span>
            <span v-else :ref="fun.three"></span>
          </div>
        </div>
      </template>
    </AccountPickerThemeOne>
    <AccountPickerThemeOne v-else-if="props.theme=='three'" v-bind="$attrs" :theme="props.theme">
      <template v-slot:default="{fun,info}">
        <div style="margin-left:0px">
          <div style="margin-left: 1%;font-size: 14px;">
            <span style="color: #666666;font-weight: bold">账套代码：</span>
            <span v-if="props.readonly==''" style="font-weight: bold;color: black;padding: 6px 10px;border-radius: 5px;background-color: #f2f2f2;">{{ info.coCode }}</span>
            <span v-else :ref="fun.one"></span>
            &nbsp;&nbsp;&nbsp;&nbsp;<span style="color: #666666;font-weight: bold">账套名称：</span> <span :ref="fun.two" style="font-weight: bold"/>
          </div>
        </div>
      </template>
    </AccountPickerThemeOne>
    <AccountPickerThemeOne v-else v-bind="$attrs">
      <template v-slot:default="{fun,info}">
        <slot :fun="fun" :info="info"></slot>
      </template>
    </AccountPickerThemeOne>
  </div>
</template>
<script setup>
import AccountPickerThemeOne from "/@/boozsoft/components/AccountPicker/components/AccountPickerThemeOne.vue";

const props = defineProps(['theme','readonly'])
</script>
